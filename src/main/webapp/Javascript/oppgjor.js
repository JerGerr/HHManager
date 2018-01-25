$(document).ready(function () {
    $("#lagUtlegg").on('click', function () {
        lagNyttUtlegg();
    });
    $(document).on('click', '.medlemCheck', function(){
        oppdaterBetalere();
    });
    $(document).on('click', '#vereMedPaaUtlegg', function () {
        oppdaterBetalere();
    });

    //Kjør JavaScript
    init();

});

//Globale variabler
var testBrukerId = 1;
var alleOppgjor = [];
var delSum = 0;

function init() {
    lastInnOppgjor(testBrukerId);
    setTimeout(function () {
        lastinn();
    },500);

    //Resten av funksjonene ligger i callbacks for å sørge for riktig rekkefølge.
}


/////////////////////////////////////////////////////
              // On-Event-funksjoner //
/////////////////////////////////////////////////////

$(document).on("click", ".checkboxes", function(event){
    var valgtSvarKnapp = $(this).attr('id');
    var utleggId = $(this).attr('data-utleggId');
    var skyldigBrukerId = $(this).attr('data-skyldigBrukerId');
    var substringed = valgtSvarKnapp.match(/\d+/g);

    var klikketKnapp = $(this);

    if ($(this).is(':checked')) {
        var ok = checkMotattRad(utleggId,skyldigBrukerId, function () {
            klikketKnapp.parent().parent().parent().fadeOut(500); //Fjern raden
        });
    }
});

//Når denne klikkes skal alle inni merkes som betalt i databasen
$(document).on("click", ".hovedCheckbox", function(event){
    console.log(alleOppgjor);
    var klikketKnapp = $(this);
    var knappNavn = $(this).attr('id');
    var oppgjorNr = knappNavn.match(/\d+/g);
    console.log("oppgjorNr: "+oppgjorNr);

    if ($(this).is(':checked')) {
        lagUtleggsbetalerListe(oppgjorNr, function () {
            klikketKnapp.parent().parent().parent().fadeOut(500); //Fjern raden
        });
        //Oppgjoret gjemmes når metoden over er over
    }
});


//////////////////////////////////////////////////////////////
        // Funksjoner som behandler data clientside //
//////////////////////////////////////////////////////////////

function oppdaterBetalere() {
    $("#betalere").text("");
    $('.medlemCheck').each(function () {
        var sum = $("#sum").val();
        var pluss = 0;
        if ($("#vereMedPaaUtlegg").is(":checked")){
            pluss = 1;
        }
        delSum = sum/($('#personer input:checked').length+pluss);
        if ($(this).is(":checked")){
            console.log($(this).attr('value'));
            $("#betalere").append('<br> '+$(this).attr('value') +' Sum: '+ delSum);
        }
    })
}

function utregnOppgjorSum() {

    var sum = 0;
    var totalSum = 0;
    for (var i = 0; i < alleOppgjor.length; i++) {
        for (var j = 0; j < alleOppgjor[i].utleggJegSkylder.length; j++) {
            sum = sum - alleOppgjor[i].utleggJegSkylder[j].delSum;
        }
        alleOppgjor[i].skylderSum = sum;
        totalSum = sum;
        sum = 0;
        for (j = 0; j < alleOppgjor[i].utleggDenneSkylderMeg.length; j++) {
            sum = sum + alleOppgjor[i].utleggDenneSkylderMeg[j].delSum;
        }
        alleOppgjor[i].skylderMegSum = sum;
        totalSum = totalSum + sum;
        if (totalSum > 0) {
            alleOppgjor[i].posNeg = "Pos";
        }
        else {
            alleOppgjor[i].posNeg = "Neg";
        }
        alleOppgjor[i].totalSum = totalSum;
    }

    displayOppgjor();
}

function lagUtleggsbetalerListe(oppgjorNr, callback) {
    console.log("OPPGJØRNR: "+oppgjorNr);
    console.log(alleOppgjor);
    var utleggsbetalere = [];
    var i;
    var gammeltObjekt;
    var utleggsbetalerObjekt;

    for (i = 0; i < alleOppgjor[oppgjorNr].utleggJegSkylder.length; i++) {
        gammeltObjekt = alleOppgjor[oppgjorNr].utleggJegSkylder[i];

        utleggsbetalerObjekt = {
            utleggId: gammeltObjekt.utleggId,
            betalt: true,
            skyldigBrukerId: gammeltObjekt.skyldigBrukerId
        };

        utleggsbetalere.push(utleggsbetalerObjekt);
    }
    console.log("utleggDenneSkylderMeg");
    console.log(alleOppgjor[oppgjorNr].utleggDenneSkylderMeg);
    for (i = 0; i < alleOppgjor[oppgjorNr].utleggDenneSkylderMeg.length; i++) {

        gammeltObjekt = alleOppgjor[oppgjorNr].utleggDenneSkylderMeg[i];
        console.log("GammeltObjekt");
        console.log(gammeltObjekt);

        utleggsbetalerObjekt = {
            utleggId: gammeltObjekt.utleggId,
            betalt: true,
            skyldigBrukerId: gammeltObjekt.skyldigBrukerId
        };

        utleggsbetalere.push(utleggsbetalerObjekt);
    }
    console.log(utleggsbetalere);
    return checkOppgjorSum(utleggsbetalere, callback);
}

//Legg til indekser på rader og oppgjør så de er raskere å finne senere
function leggInnRadNr(callback) {
    for (var i = 0; i < alleOppgjor.length; i++) {
        alleOppgjor[i].oppgjorNr = i;
        var j;
        for (j = 0; j < alleOppgjor[i].utleggJegSkylder.length; j++) {
            console.log("utleggId: "+alleOppgjor[i].utleggJegSkylder[j].utleggId);
            alleOppgjor[i].utleggJegSkylder[j].radNr = j;
        }

        for (j = 0; j < alleOppgjor[i].utleggDenneSkylderMeg.length; j++) {
            alleOppgjor[i].utleggDenneSkylderMeg[j].radNr = j;
        }
    }
    callback();
}


//////////////////////////////////////////////////////
                // AJAX-kode //
//////////////////////////////////////////////////////
//Når en rad krysses av i klienten skal den markeres som betalt i databasen
function checkMotattRad(utleggId, skyldigBrukerId, next) {
    $.ajax({
        url: 'server/utlegg/'+skyldigBrukerId+'/'+utleggId+'',
        type: 'PUT',
        success: function (result) {
            var suksess = result;
            next();
        },
        error: function () {
            alert("Noe gikk galt :(");
            return false;
        }
    });
}

function lastInnOppgjor(brukerId) {
    $.ajax({
        url: "server/utlegg/oppgjor/"+ brukerId,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            alleOppgjor = result;
            if (!result){
                alert("Noe rart har skjedd i lastInnOppgjor");
            }else{
                console.log(result);
                leggInnRadNr(utregnOppgjorSum);
            }
        },
        error: function () {
            alert("Serveren har det røft atm, prøv igjen senere :/");
        }
    })
}

function checkOppgjorSum(utleggsbetalere, next) {
    $.ajax({
        url: 'server/utlegg/utleggsbetaler',
        type: 'PUT',
        data: JSON.stringify(utleggsbetalere),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            suksess = result;
            alert("suksess ny greie: "+suksess);
            next();
        },
        error: function () {
            alert("Noe gikk galt :(");
        }
    });
}


function lagNyttUtlegg() {
    var sum = $("#sum").val();
    var beskrivelse = $("#utleggBeskrivelse").val();
    if(sum == "" || beskrivelse == ""){
        alert("pls gi en sum og beskrivelse :)");
        return;
    }
    var utleggerId = bruker.brukerId;
    var utleggsbetalere = [];
    //delSum = sum/$('#personer input:checked').length;
    $('#personer input:checked').each(function () {
        utleggsbetaler = {
            skyldigBrukerId: $(this).attr('id'),
            delSum: delSum
        };
        utleggsbetalere.push(utleggsbetaler)
    });

    utlegg = {
        utleggerId: utleggerId,
        sum: sum,
        beskrivelse: beskrivelse,
        utleggsbetalere: utleggsbetalere
    };


    $.ajax({
        url: "server/utlegg/nyttutlegg",
        type: 'POST',
        data: JSON.stringify(utlegg),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            var data =JSON.parse(result);
            if (data){
                alert(" :D");
            }else{
                alert("D:");
            }
        },
        error: function () {
            alert("RIPinpeace");
        }
    })
}


/////////////////////////////////////////////////////////
        // Kode for å legge inn dynamisk HTML //
/////////////////////////////////////////////////////////

function displayOppgjor() {
    // Compile the markup as a named template
    $.template( "oppgjorTemplate", $("#test-oppgjor"));

    $.template("rad-template", $("#rad-template"));

    //Append compiled markup
    for (var i = 0; i < alleOppgjor.length; i++) {
        $.tmpl( "oppgjorTemplate", alleOppgjor[i]).appendTo($("#panelGruppe"));

        $.tmpl( "rad-template", alleOppgjor[i].utleggJegSkylder).appendTo($("#radMinus"+i+""));
        console.log(alleOppgjor[i].utleggDenneSkylderMeg);
        $.tmpl( "rad-template", alleOppgjor[i].utleggDenneSkylderMeg).appendTo($("#radPlus"+i+""));
    }
}

function leggInnNyttOppgjor() {

}

function lastinn() {
    var husholdninger = JSON.parse(localStorage.getItem("husholdninger"));
    var husId = localStorage.getItem("husholdningId");
    console.log(husholdninger);
    //$.template( "medlemmerListe", $("#listeMedlemPls"));
    for(var j = 0, lengt = husholdninger.length; j<lengt; j++){
        if (husholdninger[j].husholdningId==husId){
            for(var k =0 , l = husholdninger[j].medlemmer.length; k<l; k++){
                var navn = husholdninger[j].medlemmer[k].navn;
                var id = husholdninger[j].medlemmer[k].brukerId;
                if (id != bruker.brukerId){
                    $("#personer").append('<li class="medlemCheck"><div><label role="button" type="checkbox" class="dropdown-menu-item checkbox">'+
                        '<input id="'+id+'" type="checkbox" role="button" value="'+navn+'" class="medlemCheck">'+
                        navn +'</label></div></li>');
                }
            }
        }
    }
}


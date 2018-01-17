package server.restklasser;

import java.util.ArrayList;

//Litt usikker på om vi faktisk skal ha denne klassen. -Toni
//Sum kalkuleres clientside
public class Oppgjor {

    ArrayList<Utleggsbetaler> utleggJegSkylder = new ArrayList<>();
    ArrayList<Utleggsbetaler> utleggDenneSkylderMeg = new ArrayList<>();
    int brukerId; //BrukerIden til en av personene du har oppgjør med
    String navn; //Navnet som hører til brukerId, så slipper vi en tur til til databasen

    public Oppgjor() {

    }

    public Oppgjor(ArrayList<Utleggsbetaler> utleggJegSkylder, ArrayList<Utleggsbetaler> utleggDenneSkylderMeg) {
        this.utleggJegSkylder = utleggJegSkylder;
        this.utleggDenneSkylderMeg = utleggDenneSkylderMeg;
    }

    //I JavaScript kan man
    //objekt.utleggJegSkylder, gå gjennom arrayet. Årdner seg.


    public ArrayList<Utleggsbetaler> getUtleggJegSkylder() {
        return utleggJegSkylder;
    }

    public void setUtleggJegSkylder(ArrayList<Utleggsbetaler> utleggJegSkylder) {
        this.utleggJegSkylder = utleggJegSkylder;
    }

    public ArrayList<Utleggsbetaler> getUtleggDenneSkylderMeg() {
        return utleggDenneSkylderMeg;
    }

    public void setUtleggDenneSkylderMeg(ArrayList<Utleggsbetaler> utleggDenneSkylderMeg) {
        this.utleggDenneSkylderMeg = utleggDenneSkylderMeg;
    }

    public int getBrukerId() {
        return brukerId;
    }

    public void setBrukerId(int brukerId) {
        this.brukerId = brukerId;
    }

    public String getNavn() {
        return navn;
    }

    public void setNavn(String navn) {
        this.navn = navn;
    }

    //Kan bare br
    public void leggTilNyUtleggsbetalerSkylderMeg(Utleggsbetaler utleggsbetalerSkylderMeg) {
        utleggDenneSkylderMeg.add(utleggsbetalerSkylderMeg);
    }


}

package server.services;

import server.controllers.StatistikkController;
import server.restklasser.Nyhetsinnlegg;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Hallvard on 19.01.2018.
 *
 */
@Path("/StatistikkService")
public class StatistikkService {

    @GET
    @Path("{husholdningId}/nyheter")
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<List<String>> getNyhetsStatistikk(@PathParam("husholdningId") int husholdningId){
        return StatistikkController.getNyhetsatistikk(husholdningId);
    }


}


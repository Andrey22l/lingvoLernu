/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.lingvolernu.rest;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import javax.net.ssl.HttpsURLConnection;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

/**
 *
 * @author Andrey
 */
@Path("/record")
public class LoginService
{

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(int index) throws URISyntaxException, JSONException
    {

//        if (index == 0)
//        {
        JSONObject object = new JSONObject();
        object.put("token", "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMjM0NTY3IiwiaWF0IjoxNDcwMTIwOTk2LCJzdWIiOiJpbnN0YWdhbGxlcnkvbG9naW4iLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvIiwic2NvcGUiOiJwdWJsaWNfYWNjZXNzIiwiZXhwIjoxNDcwMjA3Mzk2fQ.WDGBbnUrqNsP_l7dFpqkjWfSDrnXO10NRLZ71bdiqJ8");

        ResponseBuilder builder = Response.ok(object);
        return builder.build();
//        }
//        else
//        {
//            return Response.status(Response.Status.UNAUTHORIZED).build();
//        }

    }

    @POST
    @Path("/token")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String getToken(String url) throws URISyntaxException, JSONException, MalformedURLException, IOException
    {
        URL obj = new URL(url);
        HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();
        //add reuqest header
        con.setRequestMethod("GET");
//		con.setRequestProperty("User-Agent", USER_AGENT);
//        con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

//        String urlParameters = "sn=C02G8416DRJM&cn=&locale=&caller=&num=12345";
        con.setDoOutput(true);
//        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
//        wr.writeBytes(urlParameters);
//        wr.flush();
//        wr.close();

        int responseCode = con.getResponseCode();

        System.out.println("\nSending 'POST' request to URL : " + url);
//        System.out.println("Post parameters : " + urlParameters);
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null)
        {
            response.append(inputLine);
        }
        in.close();

        //print result
        System.out.println(response.toString());

        return response.toString();
    }

    @POST
    @Path("/like")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String setLike(String url) throws URISyntaxException, JSONException, MalformedURLException, IOException
    {
        String[] URL = url.split("\\?");

        URL obj = new URL(URL[0]);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        con.setRequestMethod("POST");
//        con.setRequestProperty("User-Agent", USER_AGENT);

        con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        con.setRequestProperty("charset", "utf-8");
        con.setRequestProperty("Content-Length", "" + Integer.toString(URL[1].getBytes().length));

        // For POST only - START
        con.setDoOutput(true);
        con.setUseCaches(false);
        con.setInstanceFollowRedirects(false);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        byte[] postData = URL[1].getBytes(StandardCharsets.UTF_8);
        wr.write(postData);
        wr.flush();
        wr.close();
        // For POST only - END

        int responseCode = con.getResponseCode();
        System.out.println("POST Response Code: " + responseCode);
        System.out.println("POST Response Message: " + con.getResponseMessage());

        BufferedReader in = new BufferedReader(new InputStreamReader(
                con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null)
        {
            response.append(inputLine);
        }
        in.close();

        // print result
        System.out.println(response.toString());
        return response.toString();

    }

}

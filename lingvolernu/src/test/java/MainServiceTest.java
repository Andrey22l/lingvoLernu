
import com.lingvolernu.rest.MainService;
import io.jsonwebtoken.Claims;
import java.util.Date;
import org.junit.Test;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Andrey
 */
public class MainServiceTest
{

    @Test
    public void test()
    {
        MainService service = new MainService();

        String token = service.createJWT("1234567", "http://lingvolernu:8080/", "lingvolernu/login", 86400000);
        
        Claims claims = service.parseJWT(token);
        
        System.out.println("Token: "+ token);
        System.out.println("ID: " + claims.getId());
        System.out.println("Subject: " + claims.getSubject());
        System.out.println("Issuer: " + claims.getIssuer());
        System.out.println("Expiration: " + claims.getExpiration());
        System.out.println("Scope: " + claims.get("scope"));
        
        
    }

}

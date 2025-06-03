/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlet;

import dao.MedicoJpaController;
import dto.Medico;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import utils.BcryptJava;

/**
 *
 * @author HATSUMY
 */
@WebServlet(name = "ChangePassword", urlPatterns = {"/changepassword"})
public class ChangePassword extends HttpServlet {

    MedicoJpaController aluDAO = new MedicoJpaController();

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonReader jsonReader = Json.createReader(request.getReader());
        JsonObject jsonObject = jsonReader.readObject();
        jsonReader.close();

        String username = jsonObject.getString("username");
        String password = jsonObject.getString("password");
        String newPassword = jsonObject.getString("newPassword");
        Medico alumno = aluDAO.findMedicoyUsername(username);
        JsonObject jsonResponse;
        if (alumno != null) {
            try {
                boolean checkPassword = BcryptJava.checkPassword(password, alumno.getPassMedi());
                if (!checkPassword) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
                
                
                alumno.setPassMedi(BcryptJava.hashPassword(newPassword));

                aluDAO.edit(alumno);
                jsonResponse = Json.createObjectBuilder()
                        .add("status", true)
                        .build();
                out.print(jsonResponse.toString());
                out.flush();

            } catch (Exception ex) {
                Logger.getLogger(ChangePassword.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else {
            jsonResponse = Json.createObjectBuilder()
                    .add("status", false)
                    .build();
            out.print(jsonResponse.toString());
            out.flush();
        }
    }
}

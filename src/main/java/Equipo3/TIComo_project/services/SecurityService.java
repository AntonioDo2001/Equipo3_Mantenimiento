package Equipo3.TIComo_project.services;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Equipo3.TIComo_project.dao.ClientRepository;
import Equipo3.TIComo_project.dao.RiderRepository;
import Equipo3.TIComo_project.dao.UserRepository;
import Equipo3.TIComo_project.model.Client;
import Equipo3.TIComo_project.model.Rider;
import Equipo3.TIComo_project.model.User;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

@Service
public class SecurityService {

	@Autowired
	private UserRepository userDAO;

	private String clave = "TICOMO_3";

	@Autowired
	private ClientRepository clientDAO;
	
	@Autowired
	private RiderRepository riderDAO;

	public String[] comprobarPassword(JSONObject info) {

		String[] list = new String[2];

		String pwd1 = info.getString("pwd1");
		String pwd2 = info.getString("pwd2");
		list[0] = "false";
		if (!pwd1.equals(pwd2)) {
			list[1] = "Las contraseñas tienen que ser iguales";
		}
		else {
			if(pwd1.length() < 8) {
				list[1] = "La contraseña debe tener al menos 8 caracteres";
			}
			else if (!pwd1.matches(".*[0-9].*")) {
				list[1] = "La contraseña debe contener al menos un digito";
			}
			else if (pwd1.equals(pwd1.toLowerCase())) {
				list[1] = "La contraseña debe tener al menos una mayúscula";
			}
			else if (pwd1.equals(pwd1.toUpperCase())) {
				list[1] = "La contraseña debe tener al menos una minúscula";
			}
			else {
				list[0] = "true";
				list[1] = "OK";
			}
		}
		return list;
	}

	public boolean accesoAdmin(JSONObject json){
		return tieneAcceso(json, "admin");
	}

	public boolean accesoCliente(JSONObject json){
		return tieneAcceso(json, "client");
	}
	
	public boolean accesoRider(JSONObject json) {
		return tieneAcceso(json, "rider");
	}
	
	public boolean tieneAcceso(JSONObject json, String rol) {
		User user = this.userDAO.findByCorreo(json.getString("correoAcceso"));
		if(user!=null) {
			String pwd = this.desencriptar(user.getPassword());
			if(pwd.equals(json.getString("passwordAcceso")) && user.getRol().equals(rol))
				return true;
		}
		return false;
	}
	
	public boolean isActivo(String correo) {
		User user = this.userDAO.findByCorreo(correo);
		if(user != null) {
			if(user.getRol().equals("client")) {
				Client clientee = this.clientDAO.findByCorreo(correo);
				return clientee.isActivo();
			}
			if(user.getRol().equals("rider")) {
				Rider riderr = this.riderDAO.findByCorreo(correo);
				return riderr.isActivo();
			}
			return true;
		}
		return false;
	}


	public SecretKeySpec crearClave() throws UnsupportedEncodingException, NoSuchAlgorithmException {
		byte[] claveEncriptacion = this.clave.getBytes("UTF-8");

		MessageDigest sha = MessageDigest.getInstance("SHA-1");

		claveEncriptacion = sha.digest(claveEncriptacion);
		claveEncriptacion = Arrays.copyOf(claveEncriptacion, 16);

		return new SecretKeySpec(claveEncriptacion, "AES");

	}
	public String encriptar(String datos) {
		try {
			SecretKeySpec secretKey = this.crearClave();

			Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");        
			cipher.init(Cipher.ENCRYPT_MODE, secretKey);

			byte[] datosEncriptar = datos.getBytes("UTF-8");
			byte[] bytesEncriptados = cipher.doFinal(datosEncriptar);
			return Base64.getEncoder().encodeToString(bytesEncriptados);
		} catch (InvalidKeyException | UnsupportedEncodingException | NoSuchAlgorithmException | NoSuchPaddingException
				| IllegalBlockSizeException | BadPaddingException e) {
			return "";
		}

	}
	public String desencriptar(String datosEncriptados) {
		try {
			SecretKeySpec secretKey = this.crearClave();

			Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
			cipher.init(Cipher.DECRYPT_MODE, secretKey);

			byte[] bytesEncriptados = Base64.getDecoder().decode(datosEncriptados);
			byte[] datosDesencriptados = cipher.doFinal(bytesEncriptados);
			return new String(datosDesencriptados);
		} catch (InvalidKeyException | UnsupportedEncodingException | NoSuchAlgorithmException | NoSuchPaddingException
				| IllegalBlockSizeException | BadPaddingException e) {
			return "";
		}
	}

}

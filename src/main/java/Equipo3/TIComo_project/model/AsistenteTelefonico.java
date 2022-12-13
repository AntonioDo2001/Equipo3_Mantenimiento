package Equipo3.TIComo_project.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="AsistentesTelefonicos")
public class AsistenteTelefonico {

	private String correo;
	
	

	public String getCorreo() {
		return correo;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}
}

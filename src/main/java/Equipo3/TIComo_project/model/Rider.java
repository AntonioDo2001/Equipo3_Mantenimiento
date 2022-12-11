package Equipo3.TIComo_project.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="Riders")
public class Rider {

	private String correo;
	private String tipovehiculo;
	private String matricula;
	private boolean carnet;
	private boolean activo;
	
	public boolean isActivo() {
		return activo;
	}

	public void setActivo(boolean activo) {
		this.activo = activo;
	}

	public String getMatricula() {
		return matricula;
	}

	public void setMatricula(String matricula) {
		this.matricula = matricula;
	}
	
	public String getTipovehiculo() {
		return tipovehiculo;
	}
	
	public void setTipovehiculo(String tipovehiculo) {
		this.tipovehiculo = tipovehiculo;
	}
	
	public boolean isCarnet() {
		return carnet;
	}
	
	public void setCarnet(boolean carnet) {
		this.carnet = carnet;
	}

	public String getCorreo() {
		return correo;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}
}

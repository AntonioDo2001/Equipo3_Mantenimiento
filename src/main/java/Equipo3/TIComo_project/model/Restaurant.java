package Equipo3.TIComo_project.model;

import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="Restaurants")
public class Restaurant {

	private String nombre;
	private String razonSocial;
	private String cif;
	private String direccion;
	private String telefono;
	private String email;
	private String categoria;
	
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getRazonSocial() {
		return razonSocial;
	}
	public void setRazonSocial(String razonSocial) {
		this.razonSocial = razonSocial;
	}
	public String getCif() {
		return cif;
	}
	public void setCif(String cif) {
		this.cif = cif;
	}
	public String getDireccion() {
		return direccion;
	}
	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
	public String getTelefono() {
		return telefono;
	}
	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getCategoria() {
		return categoria;
	}
	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}
	
	public JSONObject toJSON() {
		JSONObject jso = new JSONObject();
		jso.put("nombre", nombre);
		jso.put("razonSocial", razonSocial);
		jso.put("cif", cif);
		jso.put("direccion", direccion);
		jso.put("telefono", telefono);
		jso.put("email", email);
		jso.put("categoria", categoria);
		return jso;
	}
	
}

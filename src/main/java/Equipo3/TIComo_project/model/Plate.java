package Equipo3.TIComo_project.model;

import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="Plates")

public class Plate {

	private String idPlato;
	private String nombre;
	private String foto;
	private String descripcion;
	private String precio;
	private boolean aptoVegano;
	private String nombreRestaurante;
	
	public String getNombre() {
		return nombre;
	}
	
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	
	public String getFoto() {
		return foto;
	}
	
	public void setFoto(String foto) {
		this.foto = foto;
	}
	
	public String getDescripcion() {
		return descripcion;
	}
	
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	
	public String getPrecio() {
		return precio;
	}
	
	public void setPrecio(String precio) {
		this.precio = precio;
	}
	
	public boolean isAptoVegano() {
		return aptoVegano;
	}
	
	public void setAptoVegano(boolean aptoVegano) {
		this.aptoVegano = aptoVegano;
	}

	public String getNombreRestaurante() {
		return nombreRestaurante;
	}

	public void setNombreRestaurante(String nombreRestaurante) {
		this.nombreRestaurante = nombreRestaurante;
	}
	
	public String getIdPlato() {
		return idPlato;
	}

	public void setIdPlato() {
		this.idPlato = java.util.UUID.randomUUID().toString();
	}
	
	 public JSONObject toJSON() {
        JSONObject jso = new JSONObject();
        jso.put("idPlato", idPlato);
        jso.put("nombre", nombre);
        jso.put("foto", foto);
        jso.put("descripcion", descripcion);
        jso.put("precio", precio);
        jso.put("aptoVegano", aptoVegano);
        jso.put("nombreRestaurante", nombreRestaurante);
        return jso;
	 }

}


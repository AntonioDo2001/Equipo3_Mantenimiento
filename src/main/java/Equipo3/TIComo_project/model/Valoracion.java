package Equipo3.TIComo_project.model;

import java.time.LocalDate;

import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Valoraciones")
public class Valoracion {

	private String entidad;
	private String comentario;
	private int valor;
	private String autor;
	private String fecha;
	private String idPedido;
	
	public String getEntidad() {
		return entidad;
	}
	public void setEntidad(String entidad) {
		this.entidad = entidad;
	}
	public String getComentario() {
		return comentario;
	}
	public void setComentario(String comentario) {
		this.comentario = comentario;
	}
	public int getValor() {
		return valor;
	}
	public void setValor(int valor) {
		this.valor = valor;
	}
	public String getAutor() {
		return autor;
	}
	public void setAutor(String autor) {
		this.autor = autor;
	}
	public String getFecha() {
		return fecha;
	}
	public void setFecha() {
		this.fecha = LocalDate.now().toString();
	}
	public JSONObject toJSON() {
		JSONObject jso = new JSONObject();
		jso.put("entidad", entidad);
		jso.put("comentario", comentario);
		jso.put("valor", valor);
		jso.put("autor", autor);
		jso.put("fecha", fecha);
		jso.put("idPedido", idPedido);
		return jso;
	}
	public String getIdPedido() {
		return idPedido;
	}
	public void setIdPedido(String idPedido) {
		this.idPedido = idPedido;
	}
	
}

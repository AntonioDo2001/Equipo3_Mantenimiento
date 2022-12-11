package Equipo3.TIComo_project.model;

import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Pedidos")
public class Pedido {

	private String idPedido;
	private String cliente;
	private String restaurante;
	private String platos;
	private String fecha;
	private String rider;
	private int estado;
	
	public String getPlatos() {
		return platos;
	}
	public void setPlatos(String platos) {
		this.platos = platos;
	}
	public String getIdpedido() {
		return idPedido;
	}
	public void setIdpedido() {
		this.idPedido = java.util.UUID.randomUUID().toString();;
	}
	public String getCliente() {
		return cliente;
	}
	public void setCliente(String cliente) {
		this.cliente = cliente;
	}
	public String getRestaurante() {
		return restaurante;
	}
	public void setRestaurante(String restaurante) {
		this.restaurante = restaurante;
	}
	public String getFecha() {
		return fecha;
	}
	public void setFecha(String fecha) {
		this.fecha = fecha;
	}
	public String getRider() {
		return rider;
	}
	public void setRider(String rider) {
		this.rider = rider;
	}
	public int getEstado() {
		return estado;
	}
	public void setEstado(int estado) {
		this.estado = estado;
	}
	public JSONObject toJSON() {
		JSONObject jso = new JSONObject();
		jso.put("idPedido", idPedido);
		jso.put("cliente", cliente);
		jso.put("restaurante", restaurante);
		jso.put("fecha", fecha);
		jso.put("rider", rider);
		jso.put("estado", estado);
		jso.put("platos", platos);
		return jso;
	}
}

package Equipo3.TIComo_project.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Equipo3.TIComo_project.dao.PedidoRepository;
import Equipo3.TIComo_project.dao.RestaurantRepository;
import Equipo3.TIComo_project.dao.RiderRepository;
import Equipo3.TIComo_project.dao.ValoracionRepository;
import Equipo3.TIComo_project.model.Pedido;
import Equipo3.TIComo_project.model.Restaurant;
import Equipo3.TIComo_project.model.Rider;
import Equipo3.TIComo_project.model.Valoracion;

@Service
public class PedidoService {

	@Autowired
	private PedidoRepository pioDAO;
	
	@Autowired
	private ValoracionRepository valDAO;
	
	@Autowired
	private RestaurantRepository resDAO;
	
	@Autowired
	private RiderRepository ridDAO;
	
	@Autowired
	private FoodService foodService;
	
	private String noexiste = "No existe ese pedido";
	private String noexisteRes = "No existe ese restaurante";
	private String noexisteRy = "No existe ese rider";
	
	private int maximoAsignados = 5;

	public String crearPedido(JSONObject jso) {
		Pedido pedido = new Pedido();
		String res = jso.getString("restaurante");
		if (this.resDAO.findByNombre(res) != null) {
			pedido.setCliente(jso.getString("correoAcceso"));
			pedido.setIdpedido();
			pedido.setFecha(LocalDate.now().toString());
			pedido.setPlatos(jso.getString("platos"));
			pedido.setRestaurante(res);
			pedido.setRider("");
			pedido.setEstado(0);
			this.pioDAO.save(pedido);
			return "Pedido creado correctamente";
		}
		return this.noexisteRes;
	}
	
	public String cancelarPedido(String idPedido, String cliente) {
		Pedido pedi = this.pioDAO.findByidPedido(idPedido);
		if (pedi != null) {
			if(pedi.getEstado() != 0)
				return "Ya no puedes cancelar el pedido";
			if(!pedi.getCliente().equals(cliente))
				return "No puedes cancelar el pedido, no es tuyo";
			this.pioDAO.deleteByidPedido(idPedido);
			return "Pedido cancelado";
		}
		return this.noexiste;
	}
	
	public String consultarPedidosCliente(String cliente) {
		List<Pedido> listaPedidos = this.pioDAO.findAllByCliente(cliente);
		return consultarPedidos(listaPedidos);
	}
	
	public String consultarTodosPedidos() {
		List<Pedido> listaPedidos = this.pioDAO.findAll();
		return consultarPedidos(listaPedidos);
	}
	
	public String consultarPedidosPre(String restaurante) {
		if(this.resDAO.findByNombre(restaurante) == null)
			return this.noexisteRes;
		List<Pedido> listaPedidos = this.pioDAO.findAllByRestauranteAndEstado(restaurante, 0);
		return consultarPedidos(listaPedidos);
	}
	
	public String consultarPedidosRider(String correoRider) {
		List<Pedido> listaPedidos = this.pioDAO.findAllByRider(correoRider);
		return consultarPedidos(listaPedidos);
	}
	
	public String consultarPedidosRes(String restaurante) {
		if(this.resDAO.findByNombre(restaurante) == null)
			return this.noexisteRes;
		List<Pedido> listaPedidos = this.pioDAO.findAllByRestaurante(restaurante);
		return consultarPedidos(listaPedidos);
	}
	
	public String consultarPedidosEn(String rider) {
		if(this.ridDAO.findByCorreo(rider) == null)
			return this.noexisteRy;
		List<Pedido> listaPedidos = this.pioDAO.findAllByEstadoAndRider(1, rider);
		return consultarPedidos(listaPedidos);
	}
	
	public String consultarPedidos(List<Pedido> listaPedidos) {
		StringBuilder bld = new StringBuilder();
		if(!listaPedidos.isEmpty()) {
			for (int i = 0; i<listaPedidos.size(); i++) {
				Pedido pedi= listaPedidos.get(i);
				JSONObject jso = pedi.toJSON();
				if (i == listaPedidos.size() - 1)
					bld.append(jso.toString());
				else
					bld.append(jso.toString() + ";;;");
			}
			return bld.toString().replace(String.valueOf((char)92), "");
		}
		return "";
	}
	
	public String asignarRider(String idPedido, String rider) {
		Pedido pedi = this.pioDAO.findByidPedido(idPedido);
		if (pedi!=null) {
			if (pedi.getEstado() == 1)
				return "El pedido ya se ha asignado";
			else if (pedi.getEstado() == 2)
				return "El pedido ya se ha entregado";
			if(this.pioDAO.findAllByEstadoAndRider(1, rider).size() > this.maximoAsignados)
				return "No te puedes asignar a mas pedidos";
			pedi.setEstado(1);
			pedi.setRider(rider);
			this.pioDAO.deleteByidPedido(idPedido);
			this.pioDAO.save(pedi);
			return "Rider asignado";
		}
		return this.noexiste;
	}
	public String ponerEntregado(String idPedido, String rider) {
		Pedido pedi = this.pioDAO.findByidPedido(idPedido);
		if (pedi!=null) {
			if (pedi.getRider().equals(rider)) {
				if(pedi.getEstado() == 0)
					return "Debes asignarte primero";
				else if (pedi.getEstado() == 2)
					return "El pedido ya se ha entregado";
				pedi.setEstado(2);
				this.pioDAO.deleteByidPedido(idPedido);
				this.pioDAO.save(pedi);
				return "Pedido entregado";
			}
			return "No te corresponde entregar este pedido";
		}
		return this.noexiste;
	}
	
	public String hacerValoracion(JSONObject jso) {
		String entidad = jso.getString("entidad");
		if(!this.isValorado(jso.getString("idPedido"), entidad))
			return "Ya has valorado a "+entidad;

		Valoracion valora = new Valoracion();
		valora.setAutor(jso.getString("correoAcceso"));
		valora.setComentario(jso.getString("comentario"));
		valora.setEntidad(jso.getString("entidad"));
		valora.setFecha();
		valora.setIdPedido(jso.getString("idPedido"));
		valora.setValor(Integer.parseInt(jso.getString("valor")));
		this.valDAO.save(valora);
		return "Valoracion realizada";
	}
	
	public String consultarValoracionRes(String nombreRes) {
		if(this.resDAO.findByNombre(nombreRes) == null)
			return this.noexisteRes;
		return consultarValoracion(nombreRes);
	}
	
	public String consultarValoracionRider(String rider) {
		if(this.ridDAO.findByCorreo(rider) == null)
			return this.noexisteRy;
		return consultarValoracion(rider);
	}
	
	public String consultarValoracion(String entidad) {
		List<Valoracion> valoraciones = this.valDAO.findAllByEntidad(entidad);
		if (!valoraciones.isEmpty()) {
			StringBuilder bld = new StringBuilder();
			for(int i=0; i<valoraciones.size();i++) {
				Valoracion val = valoraciones.get(i);
				JSONObject jso = val.toJSON();
				if (i == valoraciones.size() - 1)
					bld.append(jso.toString());
				else
					bld.append(jso.toString() + ";;;");
			}
			return bld.toString();
		}
		return entidad + " no tiene valoraciones";
	}
	
	public String consultarFacturacion(JSONObject jso) {
		LocalDate fechaInicio = LocalDate.parse(jso.getString("fechaInicio"));
		LocalDate fechaFinal = LocalDate.parse(jso.getString("fechaFinal"));
		String nombreRes = jso.getString("restaurante");
		if(this.resDAO.findByNombre(nombreRes) != null) {
			List<Pedido> pedidos = this.pioDAO.findAllByRestaurante(nombreRes);
			if (!pedidos.isEmpty()) {
				List<Pedido> pedidosValidos = pedidosEntre(fechaInicio, fechaFinal, pedidos);
				if (!pedidosValidos.isEmpty()) 
					return ""+ calcularFacturacion(pedidosValidos);
				return "No hay pedidos entre esas fechas";
			}
			return "El restaurante no tiene pedidos";
		}
		return this.noexisteRes;
	}
	
	public float calcularFacturacion(List<Pedido> pedidosValidos) {
		float precio = 0;
		for (int i =0; i<pedidosValidos.size(); i++) {
			Pedido ped = pedidosValidos.get(i);
			String platos = ped.getPlatos();
			if(!platos.equals("")) {
				precio = precio + this.foodService.precioPlatos(platos);
			}
		}
		return precio;
	}

	public List<Pedido> pedidosEntre(LocalDate fechaInicio, LocalDate fechaFinal, List<Pedido> pedidos){
		List<Pedido> pedidosValidos = new ArrayList<>();
		for (int i= 0; i<pedidos.size(); i++) {
			Pedido ped = pedidos.get(i);
			LocalDate fecha = LocalDate.parse(ped.getFecha());
			if ((fecha.isBefore(fechaFinal) || fecha.isEqual(fechaFinal)) && (fecha.isAfter(fechaInicio) || fecha.isEqual(fechaInicio))) {
				pedidosValidos.add(ped);
			}
		}
		return pedidosValidos;
	}

	public String consultarMedia(String restaurante) {
		Restaurant res = this.resDAO.findByNombre(restaurante);
		if(res == null)
			return this.noexisteRes;
		List<Valoracion> valoraciones = this.valDAO.findAllByEntidad(restaurante);
		if (valoraciones.isEmpty())
			return "El restaurante no tiene valoraciones";
		List<Integer> valores = new ArrayList<>();
		for (int i=0; i<valoraciones.size(); i++) {
			valores.add(valoraciones.get(i).getValor());
		}
		double media = getAverage(valores); 
		return ""+media;
		
	}
	
	public String consultarMediaRyder(String ryder) {
		Rider ri = this.ridDAO.findByCorreo(ryder);
		if(ri == null)
			return this.noexisteRy;
		List<Valoracion> valoraciones = this.valDAO.findAllByEntidad(ryder);
		if (valoraciones.isEmpty())
			return "El rider no tiene valoraciones";
		List<Integer> valores = new ArrayList<>();
		for (int i=0; i<valoraciones.size(); i++) {
			valores.add(valoraciones.get(i).getValor());
		}
		double media = getAverage(valores); 
		return ""+media;

	}
	
	public double getAverage(List<Integer> list) {
        return list.stream()
                .mapToInt(a -> a)
                .average().orElse(0);
    }
	
	public void resetState(String idPedido) {
		Pedido pe = this.pioDAO.findByidPedido(idPedido);
		pe.setEstado(0);
		this.pioDAO.deleteByidPedido(idPedido);
		this.pioDAO.save(pe);
	}

	public boolean tienePedidosPendientes(String correoUsuario) {
		List<Pedido> pedidos = this.pioDAO.findAllByCliente(correoUsuario);
		if(pedidos != null) {
			for (int i=0; i<pedidos.size();i++) {
				Pedido ped = pedidos.get(i);
				if (ped.getEstado() == 0 || ped.getEstado() == 1)
					return true;
			}
		}
		return false;
	}
	
	public boolean isValorado(String entidad, String idPedido) {
		Valoracion val = this.valDAO.findByEntidadAndIdpedido(entidad, idPedido);
		return val == null;
	}
	
	public String dameValoracion(String entidad, String idPedido) {
		Valoracion val = this.valDAO.findByEntidadAndIdpedido(entidad, idPedido);
		if(val == null)
			return "No hay";
		return val.toJSON().toString();
	}

}

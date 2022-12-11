package Equipo3.TIComo_project.http;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import Equipo3.TIComo_project.services.PedidoService;
import Equipo3.TIComo_project.services.SecurityService;

@RestController
@RequestMapping("pedido")
public class PedidoController {

	@Autowired
	private PedidoService pedidoService;

	@Autowired
	private SecurityService secService;

	private String sinAcceso = "No tienes acceso a este servicio";
	
	private String inActivo = "Tu cuenta no se encuentra activa";
	
	private String correoAcceso = "correoAcceso";
	
	private String noHay = "No hay pedidos";
	
	@CrossOrigin
	@PostMapping("/crearPedido")
	public ResponseEntity<String> crearPedido(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoCliente(jso)) {
				if(this.secService.isActivo(jso.getString(this.correoAcceso))){
					return new ResponseEntity<>(this.pedidoService.crearPedido(jso), HttpStatus.OK);
				}
				return new ResponseEntity<>(this.inActivo, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@PostMapping("/cancelarPedido/{idPedido}")
	public ResponseEntity<String> cancelarPedido(@RequestBody Map<String, Object> info, @PathVariable String idPedido) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoCliente(jso)) {
				String correoCliente = jso.getString(this.correoAcceso);
				if(this.secService.isActivo(correoCliente)){
					return new ResponseEntity<>(this.pedidoService.cancelarPedido(idPedido, correoCliente), HttpStatus.OK);
				}
				return new ResponseEntity<>(this.inActivo, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@PostMapping("/consultarPedidosCliente")
	public ResponseEntity<String> consultarPedidosCliente(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoCliente(jso)) {
				if(this.secService.isActivo(jso.getString(this.correoAcceso))){
					String response = this.pedidoService.consultarPedidosCliente(jso.getString(this.correoAcceso));
					if (!response.equals(""))
						return new ResponseEntity<>(response, HttpStatus.OK);
					return new ResponseEntity<>(this.noHay, HttpStatus.OK);
				}
				return new ResponseEntity<>(this.inActivo, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@PostMapping("/consultarTodosPedidos")
	public ResponseEntity<String> consultarTodosPedidos(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoAdmin(jso)) {
				String response = this.pedidoService.consultarTodosPedidos();
				if (!response.equals(""))
					return new ResponseEntity<>(response, HttpStatus.OK);
				return new ResponseEntity<>(this.noHay, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@PostMapping("/consultarPedidosRes/{restaurante}")
	public ResponseEntity<String> consultarPedidosRestaurante(@RequestBody Map<String, Object> info, @PathVariable String restaurante) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoAdmin(jso)) {
				String response = this.pedidoService.consultarPedidosRes(restaurante);
				if (!response.equals(""))
					return new ResponseEntity<>(response, HttpStatus.OK);
				return new ResponseEntity<>(this.noHay, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@PostMapping("/consultarPedidosRider/{rider}")
	public ResponseEntity<String> consultarPedidosRider(@RequestBody Map<String, Object> info, @PathVariable String rider) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoAdmin(jso)) {
				String response = this.pedidoService.consultarPedidosRider(rider);
				if (!response.equals(""))
					return new ResponseEntity<>(response, HttpStatus.OK);
				return new ResponseEntity<>(this.noHay, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@PostMapping("/consultarPedidosPreRider/{restaurante}")
	public ResponseEntity<String> consultarPedidosPre(@RequestBody Map<String, Object> info, @PathVariable String restaurante) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoRider(jso)) {
				if(this.secService.isActivo(jso.getString(this.correoAcceso))){
					String response = this.pedidoService.consultarPedidosPre(restaurante);
					if (!response.equals(""))
						return new ResponseEntity<>(response, HttpStatus.OK);
					return new ResponseEntity<>(this.noHay, HttpStatus.OK);
				}
				return new ResponseEntity<>(this.inActivo, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@PostMapping("/consultarPedidosEnRider")
	public ResponseEntity<String> consultarPedidosEn(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoRider(jso)) {
				String rider = jso.getString(this.correoAcceso);
				if(this.secService.isActivo(rider)){
					String response = this.pedidoService.consultarPedidosEn(rider);
					if (!response.equals(""))
						return new ResponseEntity<>(response, HttpStatus.OK);
					return new ResponseEntity<>(this.noHay, HttpStatus.OK);
				}
				return new ResponseEntity<>(this.inActivo, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@PostMapping("/asignarsePedido")
	public ResponseEntity<String> asignarsePedido(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoRider(jso)) {
				String correoAccesoo = jso.getString(this.correoAcceso);
				if(this.secService.isActivo(correoAccesoo)){
					String response = this.pedidoService.asignarRider(jso.getString("idPedido"), correoAccesoo);
					return new ResponseEntity<>(response, HttpStatus.OK);
				}
				return new ResponseEntity<>(this.inActivo, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@PostMapping("/entregarPedido")
	public ResponseEntity<String> entregarPedido(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoRider(jso)) {
				String correoAccesoo = jso.getString(this.correoAcceso);
				if(this.secService.isActivo(correoAccesoo)){
					String response = this.pedidoService.ponerEntregado(jso.getString("idPedido"), correoAccesoo);
					return new ResponseEntity<>(response, HttpStatus.OK);
				}
				return new ResponseEntity<>(this.inActivo, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@PostMapping("/realizarValoracion")
	public ResponseEntity<String> realizarValoracion(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoCliente(jso)) {
				String correoAccesoo = jso.getString(this.correoAcceso);
				if(this.secService.isActivo(correoAccesoo)){
					return new ResponseEntity<>(this.pedidoService.hacerValoracion(jso), HttpStatus.OK);
				}
				return new ResponseEntity<>(this.inActivo, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@PostMapping("/consultarValoracionRestaurante")
	public ResponseEntity<String> consultarValoracionRestaurante(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			String response = this.pedidoService.consultarValoracionRes(jso.getString("restaurante"));
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@PostMapping("/consultarValoracionRider")
	public ResponseEntity<String> consultarValoracionRider(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			if(!this.secService.accesoAdmin(jso))
				return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
			String response = this.pedidoService.consultarValoracionRider(jso.getString("rider"));
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@PostMapping("/consultarFacturacion")
	public ResponseEntity<String> consultarFacturacion(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoAdmin(jso)) {
				return new ResponseEntity<>(this.pedidoService.consultarFacturacion(jso), HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@GetMapping("/consultarMedia/{restaurante}")
	public ResponseEntity<String> consultarMedia(@PathVariable String restaurante) {
		try {
			return new ResponseEntity<>(this.pedidoService.consultarMedia(restaurante), HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@PostMapping("/consultarValoracionRiderMedia")
	public ResponseEntity<String> consultarValoracionRiderMedia(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoAdmin(jso)) {
				String response = this.pedidoService.consultarMediaRyder(jso.getString("rider"));
				return new ResponseEntity<>(response, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@CrossOrigin
	@PostMapping("/consultarExisteValoracion")
	public ResponseEntity<String> consultarExisteValoracion(@RequestBody Map<String, Object> info){
		try {
			JSONObject jso = new JSONObject(info);
			if (this.secService.accesoCliente(jso)) {
				String correoAccesoo = jso.getString(this.correoAcceso);
				if(this.secService.isActivo(correoAccesoo)){
					String entidad = jso.getString("entidad");
					String idPedido = jso.getString("idPedido");
					return new ResponseEntity<>(this.pedidoService.dameValoracion(entidad, idPedido), HttpStatus.OK);
				}
				return new ResponseEntity<>(this.inActivo, HttpStatus.OK);
			}
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
}

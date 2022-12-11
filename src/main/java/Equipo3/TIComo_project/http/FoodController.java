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

import Equipo3.TIComo_project.services.FoodService;
import Equipo3.TIComo_project.services.SecurityService;

@RestController
@RequestMapping("food")
public class FoodController {

	@Autowired
	private FoodService foodService;

	@Autowired
	private SecurityService secService;

	private String nombre = "nombre";

	private String sinAcceso = "No tienes acceso a este servicio";

	@CrossOrigin
	@PostMapping("/crearRestaurante")
	public ResponseEntity<String> crearRestaurante(@RequestBody Map<String, Object> info) {
		JSONObject jso = new JSONObject(info);

		if (!this.secService.accesoAdmin(jso))
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		try {
			String response = this.foodService.crearRestaurante(jso);

			if (response.equals(this.nombre))
				return new ResponseEntity<>("Ya existe un restaurante con ese nombre", HttpStatus.OK);
			else {
				return new ResponseEntity<>(response, HttpStatus.OK);
			}
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@PostMapping("/eliminarRestaurante")
	public ResponseEntity<String> eliminarUsuario(@RequestBody Map<String, Object> info) {
		JSONObject jso = new JSONObject(info);

		if (!this.secService.accesoAdmin(jso))
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		try {
			String nombreRes = jso.getString(this.nombre);
			String response = this.foodService.eliminarRestaurante(nombreRes);

			if (response.equals(this.nombre))
				return new ResponseEntity<>("No existe un restaurante llamado " + nombreRes, HttpStatus.OK);
			else {
				return new ResponseEntity<>(response, HttpStatus.OK);
			}
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@PostMapping("/actualizarRestaurante")
	public ResponseEntity<String> actualizarRestaurante(@RequestBody Map<String, Object> info) {
		JSONObject jso = new JSONObject(info);

		if (!this.secService.accesoAdmin(jso))
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		try {
			String response = this.foodService.actualizarRestaurante(jso);
			if (response.equals(this.nombre))
				return new ResponseEntity<>("No existe un restaurante con ese nombre", HttpStatus.OK);
			else {
				return new ResponseEntity<>(response, HttpStatus.OK);
			}
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@PostMapping("/eliminarPlato")
	public ResponseEntity<String> eliminarPlato(@RequestBody Map<String, Object> info) {
		JSONObject jso = new JSONObject(info);

		if (!this.secService.accesoAdmin(jso))
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		try {
			String response = this.foodService.eliminarPlato(jso);
			if (response.equals(this.nombre))
				return new ResponseEntity<>("No existe ese plato", HttpStatus.OK);
			else {
				return new ResponseEntity<>(response, HttpStatus.OK);
			}
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@GetMapping("/consultarRestaurantes")
	public ResponseEntity<String> consultarRestaurantes() {
		try {	
			String response = this.foodService.consultarRestaurantes();
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@PostMapping("/crearPlato")
	public ResponseEntity<String> crearPlato(@RequestBody Map<String, Object> info){
		JSONObject jso = new JSONObject(info);

		if (!this.secService.accesoAdmin(jso))
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		try {
			String response = this.foodService.crearPlato(jso);
			if (response.equals(this.nombre))
				return new ResponseEntity<>("Ya existe un plato con ese nombre", HttpStatus.OK);
			else {
				return new ResponseEntity<>(response, HttpStatus.OK);
			}
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@PostMapping("/actualizarPlato")
	public ResponseEntity<String> actualizarPlato(@RequestBody Map<String, Object> info) {
		JSONObject jso = new JSONObject(info);

		if (!this.secService.accesoAdmin(jso))
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		try {
			String response = this.foodService.actualizarPlato(jso);
			if (response.equals(this.nombre))
				return new ResponseEntity<>("Ya existe un plato con ese nombre", HttpStatus.OK);
			else if (response.equals("noexiste"))
				return new ResponseEntity<>("Plato no encontrado", HttpStatus.OK);
			else {
				return new ResponseEntity<>(response, HttpStatus.OK);
			}
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@GetMapping("/getCarta/{nombreRestaurante}")
	public ResponseEntity <String> consultarCarta(@PathVariable String nombreRestaurante){
		try {
			String listaPlatos= this.foodService.platosParaEnviar(nombreRestaurante);
			if(listaPlatos.length()==0)
				return new ResponseEntity<>("", HttpStatus.OK);
			return new ResponseEntity<>(listaPlatos, HttpStatus.OK);
		}catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

	@CrossOrigin
	@PostMapping("/eliminarCarta/{restaurante}")
	public ResponseEntity<String> eliminarCarta(@PathVariable String restaurante, @RequestBody Map<String, Object> info) {
		JSONObject jso = new JSONObject(info);

		if (!this.secService.accesoAdmin(jso))
			return new ResponseEntity<>(this.sinAcceso, HttpStatus.OK);
		try {
			String response = this.foodService.eliminarCarta(restaurante);

			if (response.equals(this.nombre))
				return new ResponseEntity<>("No existe un restaurante llamado " + restaurante, HttpStatus.OK);
			else {
				return new ResponseEntity<>(response, HttpStatus.OK);
			}
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}

}

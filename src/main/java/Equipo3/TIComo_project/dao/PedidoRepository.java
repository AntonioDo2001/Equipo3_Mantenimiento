package Equipo3.TIComo_project.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import Equipo3.TIComo_project.model.Pedido;

public interface PedidoRepository extends MongoRepository <Pedido, String> {

	List<Pedido> findAllByCliente(String cliente);
	List<Pedido> findAllByEstado(int estado);
	List<Pedido> findAllByRider(String rider);
	List<Pedido> findAllByRestaurante(String restaurante);
	Pedido findByidPedido(String idPedido);
	void deleteByidPedido(String idPedido);
	
	@Query(value = "{ 'restaurante' : ?0, 'estado' : ?1 }")
	List <Pedido> findAllByRestauranteAndEstado(String restaurante, int estado);
	
	@Query(value = "{ 'estado' : ?0, 'rider' : ?1 }")
	List <Pedido> findAllByEstadoAndRider(int estado, String rider);
}

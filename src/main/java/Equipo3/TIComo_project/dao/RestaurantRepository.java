package Equipo3.TIComo_project.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import Equipo3.TIComo_project.model.Restaurant;

@Repository
public interface RestaurantRepository extends MongoRepository <Restaurant, String> {
	
	Restaurant findByNombre(String nombre);

	void deleteByNombre(String nombreRestaurante);

}

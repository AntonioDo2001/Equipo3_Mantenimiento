package Equipo3.TIComo_project.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import Equipo3.TIComo_project.model.Rider;


@Repository
public interface RiderRepository extends MongoRepository <Rider, String>{
	
	Rider findByCorreo(String correo);
	void deleteByCorreo(String correo);

}

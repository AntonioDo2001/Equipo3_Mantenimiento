package Equipo3.TIComo_project.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import Equipo3.TIComo_project.model.AsistenteTelefonico;


@Repository
public interface AsistenteTelefonicoRepository extends MongoRepository <AsistenteTelefonico, String>{
	
	AsistenteTelefonico findByCorreo(String correo);

	void deleteByCorreo(String correoUsuario);

}
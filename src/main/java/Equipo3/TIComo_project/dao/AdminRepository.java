package Equipo3.TIComo_project.dao;

import org.springframework.data.mongodb.repository.MongoRepository;

import Equipo3.TIComo_project.model.Admin;

public interface AdminRepository extends MongoRepository <Admin, String> {
	Admin findByCorreo(String correo);

	void deleteByCorreo(String correoUsuario);

}
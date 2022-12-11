package Equipo3.TIComo_project.dao;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import Equipo3.TIComo_project.model.Plate;

@Repository
public interface PlateRepository extends MongoRepository <Plate, String> {

	@Query(value = "{ 'nombre' : ?0, 'nombreRestaurante' : ?1 }")
	List <Plate> findByNombreAndNombreRestaurante(String nombre, String nombreRestaurante);

	@Query(value = "{ 'nombre' : ?0, 'nombreRestaurante' : ?1 }", delete=true)
	void deleteByNombreAndNombreRestaurante(String nombrePlato, String nombreRestaurante);

	List <Plate> findByNombreRestaurante(String nombreRes);

	void deleteByNombreRestaurante(String nombreRes);
	
	void deleteByidPlato(String idPlato);
	
	Plate findByidPlato(String idPlato);
}

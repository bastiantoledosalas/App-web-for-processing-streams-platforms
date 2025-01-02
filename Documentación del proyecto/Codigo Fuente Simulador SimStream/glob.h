#ifndef GLOBAL_H
#define GLOBAL_H

#include <cppsim.hh>
#include <iostream>
#include <map>
#include <sstream>
#include <set>
#include <vector>
#include <list>
#include <assert.h>
#include <fstream>
#include <string>
#include <limits>
#include <queue>
#include <math.h>
#include <algorithm>
#include <tuple>
#include <memory>

// Parámetros relacionados con la CPU/Memoria
#define CANT_CORES 32
#define MAX_MEMORY 100000000000 // 100 GB

// Parámetros relacionados con la RED/Comunicaciones
#define HOST 3

// Parámetros de la red
#define MTU 500   // Unidad Máxima de Transferencia

using namespace std;

// Clase Utilities con métodos estáticos para manejar strings y hashing
class Utilities{
public:
  // Método para dividir una string en tokens según un delimitador
  static std::vector<std::string> tokenizeString( std::string to_split, char delimiter = '.'){
    std::vector<std::string> splitted;
    std::size_t pos = 0, found;
    while((found = to_split.find_first_of( delimiter, pos)) != std::string::npos) {
      splitted.push_back(to_split.substr(pos, found - pos));
      pos = found+1;
    }
    splitted.push_back(to_split.substr(pos));
    return splitted;
  }

  // Método para dividir un string en tokens y convertirlos a enteros
  static std::vector< uint32_t > tokenizeStringToInt( std::string to_split, char delimiter = '.' ){
    std::vector< uint32_t > splitted_int;
    std::vector< std::string > splitted = tokenizeString( to_split );
    for( auto parts : splitted )
      splitted_int.push_back( std::stoi( parts ) );
    return splitted_int;
  }

  // Método para calcular el hash de una string
  static uint32_t hash(const string &__str){
    uint32_t h=0U;
    for(uint32_t i=0; i<__str.length(); i++){
      h+= __str.at(i);
      h+= (h<< 10);
      h^= (h>> 6);
    }
    h+=(h<< 3);
    h^=(h>> 11);
    h+=(h<< 15);
    return(h);
  }
};

// Declaración adelantada de la clase Tupla
class Tupla;

// Clase Package que representa un paquete de datos
class Package{
public:
  uint32_t _id;  // Número de identificación del paquete
  uint32_t _nro_paquetes;  // Número de paquetes
  shared_ptr<Tupla> _tupla;  // Puntero compartido a una tupla

  // Constructor por defecto
  Package(){
  }

  // Constructor parametrizado
  Package( const uint32_t& id, const uint32_t& nro_paquetes, shared_ptr<Tupla> tupla){
    this->_id           = id;
    this->_nro_paquetes = nro_paquetes;
    this->_tupla        = tupla;
  }

  // Métodos get y set para los atributos
  uint32_t id(){ return _id; }
  void id( uint32_t id ){ _id = id; }

  uint32_t nro_paquetes(){ return _nro_paquetes; }
  void nro_paquetes( uint32_t nro_paquetes ){ _nro_paquetes = nro_paquetes; }

  shared_ptr<Tupla> tupla(){ return _tupla; }
  void tupla( shared_ptr<Tupla> tupla ){ _tupla = tupla; }
};

// Clase Tupla que representa una tupla de datos
class Tupla
{
public:
  uint32_t _id;	 //ID de la tupla a nivel global de la Aplicacion Storm.
  std::string _id_tramo; //ID de la tupla en el tramo que envia entre un bolt y otro.
  uint32_t _nro_tupla;  //Nro de tupla emitido por un determinado nodo, distingue tuplas con el mismo ID, ocurre cuando hay fork (Bolt con dos destinos).
  uint32_t _copia; //Copia de la tupla, cuando un bolt emite mas de una tupla por cada una que recibe (Ej: Splitter).
  double _tpo_hold;  // Tiempo de retención
  std::string _contenido;  // Contenido de la tupla
  std::string _id_origen;  // ID del origen
  std::string _IP_origen;  // IP del origen
  std::string _id_destino;  // ID del destino
  std::string _IP_destino;  // IP del destino

  //IP destino es de la forma 10.pod_id.switch_id.host_id en base a la IP se hace el ruteo en los comm_switch.
  //Es por esta manera que (por facilidad de uso) se mantienen separados
  uint32_t pod_id;
  uint32_t switch_id;
  uint32_t host_id;

  uint32_t _copies;  // Número de copias
  uint32_t _tamanio;  // Tamaño en bytes
  double _timestamp;  // Timestamp actualizado en cada arribo al Procesador

public:
  // Constructor por defecto
  Tupla(){
  }

  // Constructor parametrizado con ID
  Tupla( uint32_t _id ){
    this->_id         = _id;
    this->_id_tramo   = "";
    this->_nro_tupla  = 0; //Id a nivel local al Spout/Bolt
    this->_copia      = 0;
    this->_tpo_hold   = 0.01;
    this->_contenido  = "";
    this->_id_origen  = "";
    this->_IP_origen  = "";
    this->_id_destino = "";
    this->_IP_destino = "";
    this->_copies     = 0;
    this->_tamanio    = 1000;
    this->_timestamp  = 0.0;
  }

 // Constructor parametrizado con ID y tiempo de retención
  Tupla( uint32_t _id, double _tpo_hold){
    this->_id         = _id;
    this->_id_tramo   = "";
    this->_nro_tupla  = 0;
    this->_copia      = 0;
    this->_tpo_hold   = _tpo_hold;
    this->_contenido  = "";
    this->_id_origen  = "";
    this->_IP_origen  = "";
    this->_id_destino = "";
    this->_IP_destino = "";
    this->_copies     = 0;
    this->_tamanio    = 1000;
    this->_timestamp  = 0.0;
  }

  // Constructor parametrizado con todos los atributos
  Tupla( uint32_t _id, std::string _id_tramo, uint32_t _nro_tupla, uint32_t _copia, double _tpo_hold, string _contenido, string _id_destino, string _IP_destino, uint32_t _copies, uint32_t tamanio ){
    this->_id         = _id;
    this->_id_tramo   = _id_tramo;
    this->_nro_tupla  = _nro_tupla;
    this->_copia      = _copia;
    this->_tpo_hold   = _tpo_hold;
    this->_contenido  = _contenido;
    this->_id_destino = _id_destino;
    this->_IP_destino = _IP_destino;
    this->_copies     = _copies;
    this->_tamanio    = _tamanio;
    this->_timestamp  = 0.0;
  }

  // Constructor de copia
  Tupla( const Tupla& tupla ){
    this->_id         = tupla._id;
    this->_id_tramo   = tupla._id_tramo;
    this->_nro_tupla  = tupla._nro_tupla;
    this->_copia      = tupla._copia;
    this->_tpo_hold   = tupla._tpo_hold;
    this->_contenido  = tupla._contenido;
    this->_id_destino = tupla._id_destino;
    this->_IP_destino = tupla._IP_destino;
    this->_copies     = tupla._copies;
    this->_tamanio    = tupla._tamanio;
    this->_timestamp  = tupla._timestamp;
  }

  // Métodos get y set para los atributos
  uint32_t id(){ return _id; }
  void id( uint32_t id ){ _id = id; }

  std::string id_tramo(){ return _id_tramo;}
  void id_tramo( std::string id_tramo ){ _id_tramo = id_tramo;}

  uint32_t nro_tupla(){ return _nro_tupla; }
  void nro_tupla( uint32_t nro_tupla ){ _nro_tupla = nro_tupla; }

  uint32_t copia(){ return _copia; }
  void copia( uint32_t copia ){ _copia = copia; }

  double tpo_hold(){ return _tpo_hold; }
  void tpo_hold( double tpo_hold ){ _tpo_hold = tpo_hold; }

  string contenido(){ return _contenido; }
  void contenido( string contenido ){ _contenido = contenido; }

  string id_origen(){ return _id_origen; }
  void id_origen( string id_origen ){ _id_origen = id_origen; }

  string IP_origen(){ return _IP_origen; }
  void IP_origen( string IP_origen ){ _IP_origen = IP_origen; }

  string id_destino(){ return _id_destino; }
  void id_destino( string id_destino ){ _id_destino = id_destino; }

  string IP_destino(){ return _IP_destino; }
  void IP_destino( string IP_destino ){ _IP_destino = IP_destino; }

  uint32_t copies(){ return _copies; }
  void copies( uint32_t copies ){ _copies = copies; }

  uint32_t tamanio(){ return this->_tamanio; }
  void tamanio( uint32_t tamanio ){ this->_tamanio = tamanio; }

  double timestamp(){ return this->_timestamp; }
  void timestamp( double timestamp ){ this->_timestamp = timestamp; }
};

#endif

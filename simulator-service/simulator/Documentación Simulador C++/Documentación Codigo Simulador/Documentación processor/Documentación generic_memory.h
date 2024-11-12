Documentación generic_memory.h:

    Clase GenericMemory:

        #ifndef GENERIC_MEMORY_H
        #define GENERIC_MEMORY_H
        #include "../glob.h"

        class GenericMemory{
            public:
                    std::string _name;          // Nombre del objeto de memoria
                    uint64_t _capacity;         // Capacidad total de la memoria
                    uint64_t _in_use;           // Espacio en uso actualmente
                    uint64_t _free_space;       // Espacio libre actualmente
                    uint64_t _cumulative_use;   // Espacio acumulado usado para estadisticas
                    double _max_use;            // Uso máximo registrado
                    uint32_t _nbr_accesses;   // Número de accesos, para estadísticas

            // Constructor por defecto que inicializa las variables  con valores predeterminados
            GenericMemory(){
                    _capacity        = MAX_MEMORY;  //Este valor corresponde a 100000000000
                    _in_use          = 0;
                    _free_space      = MAX_MEMORY;  //Este valor corresponde a 100000000000
                    _cumulative_use  = 0;
                    _max_use         = 0.0;
                    _nbr_accesses    = 0;
                }

            // Constructor con nombre y capacidad
            GenericMemory( const string& name, uint64_t capacity ){
                    _name            = "Mem_" + name;                                  
                    _capacity        = capacity;                    
                    _in_use          = 0;                           
                    _free_space      = capacity;                    
                    _cumulative_use  = 0;                           
                    _max_use         = 0.0;                         
                    _nbr_accesses    = 0;
                }

            // Retorna el nombre del objeto
            std::string to_string( ){ return this->_name; }

            // Retorna la capacidad total de la memoria
            uint64_t capacity( ){ return this->_capacity; }

            // Retorna el espacio disponible
            uint64_t free_space( ){ return this->_free_space; }

            // Accesores para obtener _in_use
            uint64_t in_use( ){ return this->_in_use; }
  
            //Accesor para establecer _in_use
            void in_use( uint64_t in_use ){ this->_in_use = in_use; }

            // MÉTODOS VIRTUALES
            // Libera el espacio definido como parámetro
            virtual void free( uint64_t ) = 0;

            // Reserva el espacio definido como parámetro
            virtual bool malloc( uint64_t ) = 0;

            // Método para estadisticas
            double average_use( ){ return (double)(this->_cumulative_use / this->_nbr_accesses); }

            // Método para estadisticas
            uint64_t max_memory_consumption( ){ return this->_max_use; }

            // Método para estadisticas
            void max_use( ){
                if( this->_max_use < this->_in_use )
                this->_max_use = this->_in_use;
                }
    }

    Clase RamMemory:

        class RamMemory : public GenericMemory{
            private:
                    std::multimap<string, shared_ptr<Tupla>> _contents;         Multimap para almacenar 'Tupla' con claves de tipo 'string'

            public: 
                    //Constructor por defecto
                    RamMemory() : GenericMemory() {}

                    //Constructor que inicializa RamMemory con nombre y capacidad
                    RamMemory(const string& name, uint64_t capacity) : GenericMemory(name, capacity) {}

                    //Método que libera espacio de memoria
                    void free(uint64_t space_to_free){
                        this->_in_use -= space_to_free;
                        this->_free_space += space_to_free;
                    }

                    //Reserva espacio de memoria si hay suficiente espacio libre
                    bool malloc(uint64_t space_to_reserve){
                        if (this->_free_space < space_to_reserve) {
                        std::cerr << this->to_string() << " cannot allocate required space into memory - in use=" << _in_use << " - free=" << _free_space << endl;
                        return false;
                        }
                        this->_in_use += space_to_reserve;
                        this->_free_space -= space_to_reserve;
                        this->_nbr_accesses++;
                        this->_cumulative_use += this->_in_use;
                        this->max_use();
                        return true;
                    }

                    //Almacena una Tupla t en _contents
                    void storeTuple(shared_ptr<Tupla> t){
                        _contents.insert(std::pair<string, shared_ptr<Tupla>>(t->contenido(), t));
                    }

                    //Elimina una Tupla t de _contents
                    void removeTuple(shared_ptr<Tupla> t){
                        auto it = this->_contents.find(t->contenido());
                        this->_contents.erase(it);
                    }       
        };

    Clase LRU:

        class LRU : public GenericMemory{
                private:
                        class TuplaLessThanComparator : public std::binary_function<shared_ptr<Tupla>,shared_ptr<Tupla>,bool>{
                public:
                        bool operator()(shared_ptr<Tupla> t1, shared_ptr<Tupla> t2) const {
                            return t1->timestamp() > t2->timestamp();
                        }
                };

                Proposito General:
                    'TuplaLessThanComparator' define un criterio de comparación para ordenar 'Tupla' en la 'priority_queue'
                    Compara 'Tupla' basado en su 'timestamp' de modo que las tuplas más recientes tienen menor prioridad (serán las últimas en ser removidas)


                std::priority_queue<shared_ptr<Tupla>, vector<shared_ptr<Tupla>>, TuplaLessThanComparator> contents;
                
                Proposito General:
                    Almacena 'Tupla' con una política de 'Least Recently Used'
                    Las tuplas con el 'timestamp' más antiguo estarán en la cima de la cola y serán removidas primero cuando se necesite espacio

                class TuplaEqualComparator : public std::binary_function<shared_ptr<Tupla>,shared_ptr<Tupla>,bool>{
                    public:
                            bool operator()(shared_ptr<Tupla> t1, shared_ptr<Tupla> t2) const {
                                return !(t1->contenido() > t2->contenido()) && !(t2->contenido() > t1->contenido());
                            }
                    };
                
                Proposito General:
                    Define un criterio de igualdad para 'Tupla' basado en su 'contenido'
                    Dos tuplas se consideran iguales si su contenido es igual

                    std::set<shared_ptr<Tupla>, TuplaEqualComparator> storedElements;
                    
                    Proposito General:
                        Almacena 'Tupla' para verificar la existencia antes de insertarlas en 'contents'
                        Garantiza que no haya duplicados en la memoria

                public:

                        //llama al constructor por defecto de 'GenericMemory'
                        LRU() : GenericMemory() {}

                        //Constructor con parámetros e inicializar el objeto LRU con un nombre y capacidad especificados
                        //llamando al constructor correspondiente de GenericMemory
                        LRU(const string& name, uint64_t capacity) : GenericMemory(name, capacity) {} 


                    void free(uint64_t space_to_free){
                        assert(capacity() > space_to_free);
                        while (free_space() < space_to_free) {
                            shared_ptr<Tupla> tupla = contents.top();
                            contents.pop();
                            this->_free_space += tupla->tamanio();
                        }
                    }

                    Proposito General:
                        Libera espacio en memoria hasta alcanzar el espacio requerido 'space_to_free'
                        Remueve tuplas de la 'priority_queue' ('contents') hasta que haya suficiente espacio libre

                    bool malloc(uint64_t){
                        return true;
                    }

                    Proposito General:
                        Se simula la reserva de espacio en memoria.
                        Retorna siempre un valor 'true' indicando que la operación es siempre exitosa

                    void insert(shared_ptr<Tupla> tupla){
                        if (storedElements.find(tupla) == storedElements.end()) {
                            free(tupla->tamanio());
                            storedElements.insert(tupla);
                            contents.push(tupla);
                            malloc(tupla->tamanio());
                        }
                    }

                    Proposito General:
                        Inserta una 'Tupla' en la memoria. Si la 'Tupla' no está ya presente en 'storedElements', libera el espacio necesario llamando a 'free'
                        Luego inserta la 'Tupla' en 'storedElements' y 'contents' y finalmente llama a 'malloc' para simular la reserva de memoria
        };



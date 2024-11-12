Documentación del Makefile:

    Definición de Variables:

        TARGET=Simulador            
        CXX=g++
        INCLUDES=-I../libcppsim-0.2.5/src/
        LIBRARY=-L../libcppsim-0.2.5/src/
        CFLAGS=-O3 -ggdb -Wall -lm $(INCLUDES) -g -lcppsim $(LIBRARY) -std=c++11

        TARGET=Simulador:   Define el nombre del archivo ejecutable resultante
                            En este caso el archivo ejecutable tendra el nombre de 'Simulador'
        CXX=g++         :   Define el compilador a usar, en este caso 'g++'

        INCLUDES=-I../libcppsim-0.2.5/src/: Define las rutas de los archivos de cabecera
                
                -I: Es una opción del compilador g++ (y gcc) que se utiliza para añadir un directorio a la lista de rutas de búsqueda de archivos de cabecera
                Esto le dice al compilador dónde buscar archivos .h que se incluyen en el código fuente
                ../libcppsim-0.2.5/src/: Es la ruta relativa donde se encuentran los archivos de cabecera
                La ruta ../ indica que debe ir un nivel arriba del directorio actual (donde se está ejecutando el Makefile) y luego buscar en libcppsim-0.2.5/src/

        LIBRARY=-L../libcppsim-0.2.5/src/:      Define las rutas de las bibliotecas

            Define una variable LIBRARY que especifica una ruta de búsqueda para las bibliotecas compartidas o estáticas necesarias durante el enlace (linking) del proyecto
            -L: Es una opción del enlazador (ld, utilizado por g++) que se utiliza para añadir un directorio a la lista de rutas de búsqueda de bibliotecas
            Esto le dice al enlazador dónde buscar archivos de biblioteca (como .so en Linux o .a)
            ../libcppsim-0.2.5/src/: Es la ruta relativa donde se encuentran los archivos de cabecera
            La ruta ../ indica que debe ir un nivel arriba del directorio actual (donde se está ejecutando el Makefile) y luego buscar en libcppsim-0.2.5/src/
        
        CFLAGS=-O3 -ggdb -Wall -lm $(INCLUDES) -g -lcppsim $(LIBRARY) -std=c++11                                      
            
            Define las banderas de compilación
            Incluyendo optimización '-03'
            Información de depuración '-ggdb'
            Mostrar todos los errores '-Wall'
            Estándar de C++ '-std=c++11'

    Definición de Objetos:

        OBJS=obj/main.o obj/node.o obj/spout.o obj/bolt.o obj/processor.o obj/prob.o obj/core.o obj/net_iface.o obj/comm_switch.o obj/generator.o

        OBJS:   Lista de archivos objeto que se van a generar y enlazar para formar el ejecutable
                Es necesario tener creado el directorio 'obj' para que el compilador pueda mover los objetos que se crearan al directorio 'obj'
        
    Reglas para Generar el Ejecutable:

        $(TARGET): $(OBJS) 
            $(CXX) -o $@ $^ $(CFLAGS) $(LIBRARY) 

        $(TARGET)                           :   Define que el objetivo TARGET depende de los archivos objeto $(OBJS)
        $(CXX) -o $@ $^ $(CFLAGS) $(LIBRARY):   Define el comando para compilar los archivos objeto y generar el ejecutable:
                                                $@ se expande a TARGET (Simulador)
                                                $^ se expande a todos los archivos objeto $(OBJS)
    
    Reglas para Generar Archivos Objeto:

        obj/main.o:main.cc
        obj/node.o:node.cc node.h
        obj/spout.o:spout.cc spout.h
        obj/bolt.o:bolt.cc bolt.h
        obj/processor.o:processor/processor.cc processor/processor.h
        obj/core.o:processor/core.cc processor/core.h
        obj/prob.o:distributions/prob.cc distributions/prob.h
        obj/net_iface.o:network/net_iface.cc network/net_iface.h
        obj/comm_switch.o:network/comm_switch.cc network/comm_switch.h
        obj/generator.o:generator/generator.cc generator/generator.h

        Estas reglas especifican cómo generar cada archivo objeto, indicando sus dependencias (archivos fuente y cabeceras)
    
    Regla Genérica para Generar Archivos Objeto:

        obj/%.o:
            $(CXX) -o $@ -c $< $(CFLAGS)

        obj/%.o:    Define una regla genérica para cualquier archivo objeto en el directorio obj/
        $@          Se expande al nombre del archivo objeto
        $<          se expande al nombre del archivo fuente

        $(CXX) -o $@ -c $< $(CFLAGS): Define el comando para compilar el archivo fuente y generar el archivo objeto

    Regla clean:

        clean:
            ${RM} $(TARGET)
            ${RM} obj/*.o
            ${RM} *~

        Define un objetivo para limpiar los archivos generados(el ejecutable y los archivos objeto)
        ${RM} es una variable predefinida que normalmente se expande a rm -f

    Regla all:
        
        all:
            make clean
            make

        all: Define un objetivo que primero limpia los archivos generados y luego recompila todo desde cero
    
    Este Makefile define cómo compilar y enlazar un proyecto C++ que depende de la biblioteca libcppsim-0.2.5
    Utiliza reglas específicas y genéricas para gestionar los archivos objeto y proporciona objetivos clean
    y all para facilitar la gestión de la compilación y limpieza del proyecto
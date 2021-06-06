import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Cita from './components/Cita';
import Formulario from './components/Formulario';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [mostrarForm, guardarMostrarForm] = useState(false);

  const [citas, setCitas] = useState([]);

  useEffect(() => {
    getCitasStorage();
  }, []);

  const eliminarCita = id => {
    setCitas(citasActuales => {
      return citasActuales.filter(cita => cita.id !== id);
    });
    eliminarCitaStorage(id)
  };

  const eliminarCitaStorage = id => {
    const citasFiltradas = citas.filter(cita => cita.id !== id);
    setCitas(citasFiltradas);
    guardarCitasStorage(JSON.stringify(citasFiltradas));
  };

  const changeStateForm = () => {
    guardarMostrarForm(!mostrarForm);
  };

  const cerrarTeclado = () => {
    Keyboard.dismiss();
  };

  const guardarCitasStorage = async citas => {
    try {
      await AsyncStorage.setItem('citas', citas);
    } catch (error) {
      console.log(error);
    }
  };

  const getCitasStorage = async () => {
    try {
      const citasStorage = await AsyncStorage.getItem('citas');
      if (citasStorage) {
        setCitas(JSON.parse(citasStorage));
      } else {
        setCitas([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => cerrarTeclado()}>
      <ScrollView style={styles.contenedor}>
        <Text style={styles.titulo}>Administrador de citas</Text>
        <View>
          <TouchableHighlight
            style={styles.btn}
            onPress={() => changeStateForm()}>
            <Text style={styles.textobtn}>
              {mostrarForm ? 'Administre citas' : 'Agregue una cita'}
            </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.contenido}>
          {mostrarForm ? (
            <Formulario
              setCitas={setCitas}
              citas={citas}
              guardarMostrarForm={guardarMostrarForm}
              guardarCitasStorage={guardarCitasStorage}
            />
          ) : (
            <>
              <Text style={styles.titulo}>
                {citas.length > 0 ? 'Administra tus citas' : 'No hay citas'}
              </Text>
              <FlatList
                style={styles.listado}
                data={citas}
                renderItem={({item}) => (
                  <Cita cita={item} eliminarCita={eliminarCita}/>
                )}
                keyExtractor={cita => cita.id}
              />
            </>
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: '#AA0768',
    flex: 1,
  },
  contenido: {
    flex: 1,
    marginHorizontal: '2.5%',
  },
  titulo: {
    color: '#FFF',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listado: {
    flex: 1,
  },
  btn: {
    padding: 10,
    backgroundColor: '#7d024e',
    marginVertical: 10,
  },
  textobtn: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;

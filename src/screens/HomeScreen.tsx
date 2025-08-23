import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import { HeaderContainer, HeaderTitle } from '../components/Header';
import theme from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from '../types/appointments';
import { Doctor } from '../types/doctors';
import { RootStackParamList } from '../types/navigation';
import { useFocusEffect } from '@react-navigation/native';

// Define a tipagem para as propriedades de navegação da tela Home.
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

// Mock de dados dos médicos. Em uma aplicação real, isso viria de uma API.
const doctors: Doctor[] = [
  { id: '1', name: 'Dr. João Silva', specialty: 'Cardiologista', image: 'https://mighty.tools/mockmind-api/content/human/91.jpg', },
  { id: '2', name: 'Dra. Maria Santos', specialty: 'Dermatologista', image: 'https://mighty.tools/mockmind-api/content/human/97.jpg', },
  { id: '3', name: 'Dr. Pedro Oliveira', specialty: 'Oftalmologista', image: 'https://mighty.tools/mockmind-api/content/human/79.jpg', },
];

// Componente funcional principal da tela Home.
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation } ) => {
  // Estado para armazenar a lista de consultas.
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Estado para controlar a animação de "puxar para atualizar".
  const [refreshing, setRefreshing] = useState(false);

  // Função para carregar as consultas do armazenamento local (AsyncStorage).
  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (storedAppointments) {
        // Se houver consultas salvas, atualiza o estado.
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    }
  };

  // Hook do React Navigation que executa uma função sempre que a tela está em foco.
  useFocusEffect(
    React.useCallback(() => {
      // Chama a função para carregar as consultas.
      loadAppointments();
    }, [])
  );

  // Função executada quando o usuário "puxa para atualizar" a lista.
  const onRefresh = async () => {
    setRefreshing(true); // Inicia a animação de refresh.
    await loadAppointments(); // Recarrega os dados.
    setRefreshing(false); // Para a animação de refresh.
  };

  // Função para buscar as informações de um médico pelo seu ID.
  const getDoctorInfo = (doctorId: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === doctorId);
  };

  // Função que renderiza cada item da lista de consultas (FlatList).
  const renderAppointment = ({ item }: { item: Appointment }) => {
    // Busca as informações do médico associado à consulta.
    const doctor = getDoctorInfo(item.doctorId);
    return (
      // Este é o card que representa uma consulta na interface.
      <AppointmentCard>
        <DoctorImage source={{ uri: doctor?.image || 'https://via.placeholder.com/100' }} />
        <InfoContainer>
          <DoctorName>{doctor?.name || 'Médico não encontrado'}</DoctorName>
          <DoctorSpecialty>{doctor?.specialty || 'Especialidade não encontrada'}</DoctorSpecialty>
          <DateTime>{new Date(item.date ).toLocaleDateString()} - {item.time}</DateTime>
          <Description>{item.description}</Description>
          {/* O status da consulta (Pendente/Confirmado) é exibido aqui. */}
          <Status status={item.status}>
            {item.status === 'pending' ? 'Pendente' : 'Confirmado'}
          </Status>
          {/* Botões de ação para editar e excluir a consulta. */}
          <ActionButtons>
            <ActionButton>
              <Icon name="edit" type="material" size={20} color={theme.colors.primary} />
            </ActionButton>
            <ActionButton>
              <Icon name="delete" type="material" size={20} color={theme.colors.error} />
            </ActionButton>
          </ActionButtons>
        </InfoContainer>
      </AppointmentCard>
    );
  };

  // Retorna a estrutura JSX que compõe a tela.
  return (
    <Container>
      {/* Componente de cabeçalho da tela. */}
      <HeaderContainer>
        <HeaderTitle>Minhas Consultas</HeaderTitle>
      </HeaderContainer>
      <Content>
        {/* Botão que leva o usuário para a tela de agendar uma nova consulta. */}
        <Button
          title="Agendar Nova Consulta"
          icon={<FontAwesome name="calendar-plus-o" size={20} color="white" style={{ marginRight: 8 }} />}
          buttonStyle={{ backgroundColor: theme.colors.primary, borderRadius: 8, padding: 12, marginBottom: theme.spacing.medium }}
          onPress={() => navigation.navigate('CreateAppointment')}
        />
        {/* Componente FlatList para exibir a lista de consultas de forma otimizada. */}
        <AppointmentList
          data={appointments}
          keyExtractor={(item: Appointment) => item.id}
          renderItem={renderAppointment}
          // Habilita a funcionalidade "puxar para atualizar".
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // Exibe uma mensagem quando a lista de consultas está vazia.
          ListEmptyComponent={
            <EmptyText>Nenhuma consulta agendada</EmptyText>
          }
        />
      </Content>
    </Container>
  );
};

// A seguir, temos os componentes estilizados com styled-components, que definem a aparência da interface.

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.medium}px;
`;

const AppointmentList = styled(FlatList)`
  flex: 1;
`;

const AppointmentCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: ${theme.spacing.medium}px;
  margin-bottom: ${theme.spacing.medium}px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

const DoctorImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${theme.spacing.medium}px;
`;

const InfoContainer = styled.View`
  flex: 1;
`;

const DoctorName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
`;

const DoctorSpecialty = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-bottom: 4px;
`;

const DateTime = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.primary};
  margin-top: 4px;
`;

const Description = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-top: 4px;
`;

const Status = styled.Text<{ status: string }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { status: string }) => props.status === 'pending' ? theme.colors.error : theme.colors.success};
  margin-top: 4px;
  font-weight: bold;
`;

const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${theme.spacing.small}px;
`;

const ActionButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.small}px;
  margin-left: ${theme.spacing.small}px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  opacity: 0.6;
  margin-top: ${theme.spacing.large}px;
`;

// Exporta o componente HomeScreen para que ele possa ser usado no sistema de navegação do app.
export default HomeScreen;
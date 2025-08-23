// Importações de bibliotecas e componentes necessários.
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext'; // Hook para obter o usuário logado.
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native'; // Hook para executar código quando a tela está em foco.
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme'; // Tema de estilos do app.
import Header from '../components/Header'; // Componente de cabeçalho.
import AsyncStorage from '@react-native-async-storage/async-storage'; // API para armazenamento local.

// Define a tipagem para as propriedades de navegação da tela.
type UserManagementScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserManagement'>;
};

// Interface para definir a estrutura de um objeto de usuário.
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

// Interface para a tipagem de propriedades em componentes estilizados.
interface StyledProps {
  role: string;
}

// Componente funcional que representa a tela de Gerenciamento de Usuários.
const UserManagementScreen: React.FC = () => {
  // Extrai o usuário logado do contexto de autenticação.
  const { user } = useAuth();
  // Hook para obter o objeto de navegação.
  const navigation = useNavigation<UserManagementScreenProps['navigation']>();
  // Estados para armazenar a lista de usuários e o status de carregamento.
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Função assíncrona para carregar a lista de usuários do AsyncStorage.
  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        // Filtra a lista para não exibir o próprio usuário logado.
        const filteredUsers = allUsers.filter(u => u.id !== user?.id);
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false); // Finaliza o estado de carregamento.
    }
  };

  // Função para deletar um usuário da lista no AsyncStorage.
  const handleDeleteUser = async (userId: string) => {
    try {
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        // Cria uma nova lista contendo todos os usuários, exceto o que foi deletado.
        const updatedUsers = allUsers.filter(u => u.id !== userId);
        // Salva a nova lista de volta no AsyncStorage.
        await AsyncStorage.setItem('@MedicalApp:users', JSON.stringify(updatedUsers));
        loadUsers(); // Recarrega a lista na tela para refletir a mudança.
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  // Hook que chama a função `loadUsers` toda vez que a tela entra em foco.
  useFocusEffect(
    React.useCallback(() => {
      loadUsers();
    }, [])
  );

  // Função auxiliar para traduzir a 'role' (perfil) para um texto legível.
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'doctor':
        return 'Médico';
      case 'patient':
        return 'Paciente';
      default:
        return role;
    }
  };

  // Estrutura JSX da tela.
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Gerenciar Usuários</Title>

        {/* Botão para adicionar um novo usuário (funcionalidade não implementada). */}
        <Button
          title="Adicionar Novo Usuário"
          onPress={() => {}}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Renderização condicional: mostra texto de carregamento, lista de usuários ou texto de lista vazia. */}
        {loading ? (
          <LoadingText>Carregando usuários...</LoadingText>
        ) : users.length === 0 ? (
          <EmptyText>Nenhum usuário cadastrado</EmptyText>
        ) : (
          // Mapeia a lista de usuários para renderizar um card para cada um.
          users.map((user) => (
            <UserCard key={user.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.userName as TextStyle}>
                  {user.name}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.userEmail as TextStyle}>
                  {user.email}
                </ListItem.Subtitle>
                <RoleBadge role={user.role}>
                  <RoleText role={user.role}>
                    {getRoleText(user.role)}
                  </RoleText>
                </RoleBadge>
                {/* Container para os botões de ação (Editar/Excluir). */}
                <ButtonContainer>
                  <Button
                    title="Editar"
                    onPress={() => {}} // Funcionalidade de edição não implementada.
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.editButton}
                  />
                  <Button
                    title="Excluir"
                    onPress={() => handleDeleteUser(user.id)}
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.deleteButton}
                  />
                </ButtonContainer>
              </ListItem.Content>
            </UserCard>
          ))
        )}

        {/* Botão para voltar à tela anterior. */}
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.backButton}
        />
      </ScrollView>
    </Container>
  );
};

// Objeto de estilos para componentes que não são styled-components.
const styles = {
  scrollContent: {
    padding: 20,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  backButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  actionButton: {
    marginTop: 8,
    width: '48%',
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
};

// Componentes estilizados com a biblioteca styled-components.
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const UserCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const RoleBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20';
      case 'doctor':
        return theme.colors.success + '20';
      default:
        return theme.colors.secondary + '20';
    }
  }};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const RoleText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary;
      case 'doctor':
        return theme.colors.success;
      default:
        return theme.colors.secondary;
    }
  }};
  font-size: 12px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

// Exporta o componente UserManagementScreen.
export default UserManagementScreen;
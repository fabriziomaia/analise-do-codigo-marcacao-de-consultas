// Importações de bibliotecas e componentes necessários.
import React from 'react';
import styled from 'styled-components/native';
import { Button, ListItem } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext'; // Hook para acessar dados de usuário e função de logout.
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme'; // Tema de cores e estilos do app.
import Header from '../components/Header'; // Componente de cabeçalho.
import { ViewStyle } from 'react-native';

// Define a tipagem para as propriedades de navegação da tela de Perfil.
type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

// Componente funcional que representa a tela de Perfil do usuário.
const ProfileScreen: React.FC = () => {
  // Extrai os dados do usuário (user) e a função de logout (signOut) do contexto de autenticação.
  const { user, signOut } = useAuth();
  // Hook para obter o objeto de navegação.
  const navigation = useNavigation<ProfileScreenProps['navigation']>();

  // Função auxiliar para traduzir o tipo de perfil (role) para um texto legível.
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

  // Estrutura JSX da tela de perfil.
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Meu Perfil</Title>

        {/* Card principal com as informações do usuário. */}
        <ProfileCard>
          <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />
          <Name>{user?.name}</Name>
          <Email>{user?.email}</Email>
          {/* Badge que exibe o tipo de perfil do usuário. */}
          <RoleBadge role={user?.role || ''}>
            <RoleText>{getRoleText(user?.role || '' )}</RoleText>
          </RoleBadge>
          
          {/* Exibe a especialidade apenas se o usuário for um médico. */}
          {user?.role === 'doctor' && (
            <SpecialtyText>Especialidade: {user?.specialty}</SpecialtyText>
          )}
        </ProfileCard>

        {/* Botão para navegar para a tela de edição de perfil. */}
        <Button
          title="Editar Perfil"
          onPress={() => navigation.navigate('EditProfile' as any)}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.editButton}
        />

        {/* Botão para voltar para a tela anterior na pilha de navegação. */}
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão para executar a função de logout. */}
        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
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
  editButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
  },
};

// Componentes estilizados com a biblioteca styled-components.
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ScrollView = styled.ScrollView`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const ProfileCard = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 16px;
`;

const Name = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const Email = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

// O estilo do Badge muda de cor com base no tipo de perfil (role) do usuário.
const RoleBadge = styled.View<{ role: string }>`
  background-color: ${(props: { role: string }) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20'; // Adiciona transparência à cor.
      case 'doctor':
        return theme.colors.success + '20';
      default:
        return theme.colors.secondary + '20';
    }
  }};
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

const SpecialtyText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-top: 8px;
`;

// Exporta o componente ProfileScreen.
export default ProfileScreen;
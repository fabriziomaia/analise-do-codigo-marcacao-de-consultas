// Importações de bibliotecas e componentes do React e React Native.
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Input, Button, Text } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext'; // Hook para acessar a função de registro.
import theme from '../styles/theme'; // Tema de estilos do aplicativo.
import { ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Define a tipagem para as propriedades de navegação da tela de Cadastro.
type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

// Componente funcional que representa a tela de Cadastro.
const RegisterScreen: React.FC = () => {
  // Extrai a função de registro (register) do contexto de autenticação.
  const { register } = useAuth();
  // Hook para obter o objeto de navegação e poder transitar entre telas.
  const navigation = useNavigation<RegisterScreenProps['navigation']>();
  // Estados para armazenar os dados do formulário (nome, email, senha), o status de carregamento e mensagens de erro.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função assíncrona para lidar com a submissão do formulário de cadastro.
  const handleRegister = async () => {
    try {
      setLoading(true); // Ativa o indicador de carregamento.
      setError(''); // Limpa mensagens de erro anteriores.

      // Validação simples para garantir que todos os campos foram preenchidos.
      if (!name || !email || !password) {
        setError('Por favor, preencha todos os campos');
        return; // Interrompe a execução se a validação falhar.
      }

      // Chama a função de registro do contexto de autenticação com os dados do usuário.
      await register({
        name,
        email,
        password,
      });

      // Se o registro for bem-sucedido, navega o usuário para a tela de Login.
      navigation.navigate('Login');
    } catch (err) {
      // Em caso de falha no registro, exibe uma mensagem de erro genérica.
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      // Garante que o indicador de carregamento seja desativado no final do processo.
      setLoading(false);
    }
  };

  // Estrutura JSX da tela de cadastro.
  return (
    <Container>
      <Title>Cadastro de Paciente</Title>
      
      {/* Campo de entrada para o nome completo do usuário. */}
      <Input
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
        autoCapitalize="words" // Capitaliza a primeira letra de cada palavra.
        containerStyle={styles.input}
      />

      {/* Campo de entrada para o email do usuário. */}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none" // Não aplica capitalização automática.
        keyboardType="email-address" // Otimiza o teclado para entrada de email.
        containerStyle={styles.input}
      />

      {/* Campo de entrada para a senha do usuário. */}
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Oculta os caracteres digitados.
        containerStyle={styles.input}
      />

      {/* Exibe a mensagem de erro, se houver. */}
      {error ? <ErrorText>{error}</ErrorText> : null}

      {/* Botão principal para submeter o formulário de cadastro. */}
      <Button
        title="Cadastrar"
        onPress={handleRegister}
        loading={loading} // Exibe a animação de carregamento.
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      {/* Botão secundário para retornar à tela de Login. */}
      <Button
        title="Voltar para Login"
        onPress={() => navigation.navigate('Login')}
        containerStyle={styles.backButton as ViewStyle}
        buttonStyle={styles.backButtonStyle}
      />
    </Container>
  );
};

// Objeto de estilos para os componentes que não são styled-components.
const styles = {
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  backButton: {
    marginTop: 10,
    width: '100%',
  },
  backButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
};

// Componentes estilizados com a biblioteca styled-components.
const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: ${theme.colors.text};
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

// Exporta o componente RegisterScreen para ser usado no sistema de navegação.
export default RegisterScreen;
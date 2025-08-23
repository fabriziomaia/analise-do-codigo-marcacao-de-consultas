// Importações de bibliotecas e componentes necessários para a tela de login.
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Input, Button, Text } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext'; // Hook para acessar o contexto de autenticação.
import theme from '../styles/theme'; // Objeto com as cores e estilos padrão do app.
import { ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Define a tipagem para as propriedades de navegação da tela de Login.
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

// Componente funcional que representa a tela de Login.
const LoginScreen: React.FC = () => {
  // Extrai a função signIn do contexto de autenticação.
  const { signIn } = useAuth();
  // Hook para obter o objeto de navegação e poder transitar entre telas.
  const navigation = useNavigation<LoginScreenProps['navigation']>();
  // Estados do componente para armazenar email, senha, status de carregamento e mensagens de erro.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função assíncrona para lidar com a tentativa de login.
  const handleLogin = async () => {
    try {
      setLoading(true); // Ativa o indicador de carregamento no botão.
      setError(''); // Limpa erros anteriores.
      // Chama a função de autenticação com as credenciais fornecidas.
      await signIn({ email, password });
    } catch (err) {
      // Em caso de falha, define uma mensagem de erro.
      setError('Email ou senha inválidos');
    } finally {
      // Garante que o indicador de carregamento seja desativado ao final do processo.
      setLoading(false);
    }
  };

  // Estrutura JSX da tela de login.
  return (
    <Container>
      <Title>App Marcação de Consultas</Title>
      
      {/* Campo de entrada para o email do usuário. */}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.input}
      />

      {/* Campo de entrada para a senha do usuário. */}
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Oculta os caracteres da senha.
        containerStyle={styles.input}
      />

      {/* Exibe a mensagem de erro, se houver alguma. */}
      {error ? <ErrorText>{error}</ErrorText> : null}

      {/* Botão principal para submeter o formulário de login. */}
      <Button
        title="Entrar"
        onPress={handleLogin}
        loading={loading} // Mostra a animação de carregamento se loading for true.
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      {/* Botão secundário para navegar para a tela de cadastro. */}
      <Button
        title="Cadastrar Novo Paciente"
        onPress={() => navigation.navigate('Register')}
        containerStyle={styles.registerButton as ViewStyle}
        buttonStyle={styles.registerButtonStyle}
      />

      {/* Bloco de texto com dicas de credenciais para teste. */}
      <Text style={styles.hint}>
        Use as credenciais de exemplo:
      </Text>
      <Text style={styles.credentials}>
        Admin: admin@example.com / 123456{'\n'}
        Médicos: joao@example.com, maria@example.com, pedro@example.com / 123456
      </Text>
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
  registerButton: {
    marginTop: 10,
    width: '100%',
  },
  registerButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  hint: {
    marginTop: 20,
    textAlign: 'center' as const,
    color: theme.colors.text,
  },
  credentials: {
    marginTop: 10,
    textAlign: 'center' as const,
    color: theme.colors.text,
    fontSize: 12,
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

// Exporta o componente LoginScreen para ser utilizado no app.
export default LoginScreen;
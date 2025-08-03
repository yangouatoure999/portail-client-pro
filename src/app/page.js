'use client'; // Très important pour Next.js

import { Amplify } from 'aws-amplify';
import { post } from 'aws-amplify/api'; // Nouvelle importation pour l'API
import { Authenticator, Card, Heading, Text, Button, Flex, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
import { useState } from 'react';

// --- CONFIGURATION AMPLIFY ---
Amplify.configure({ ...awsExports, ssr: true });
// --- FIN DE LA CONFIGURATION ---

// Le tableau de bord après connexion
const Dashboard = ({ user, signOut }) => {
  const [status, setStatus] = useState('');

  const handleActivation = async () => {
    setStatus('Activation en cours...');
    try {
      // Le nom de l'API est trouvé dynamiquement depuis la configuration
      const apiName = Object.keys(awsExports.API.REST)[0]; 

      // On crée l'opération POST
      const restOperation = post({
        apiName: apiName,
        path: '/activate'
      });

      // On exécute l'opération et on attend la réponse
      const { body } = await restOperation.response;
      const response = await body.json();
      
      setStatus(`Activation réussie ! Votre accès sera prêt dans quelques instants.`);
      console.log('API Response:', response);

    } catch (error) {
      console.error("Erreur lors de l'activation:", error);
      setStatus("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <View padding="2rem" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading level={3} color="white">Bienvenue, {user.username}</Heading>
        <Button onClick={signOut}>Déconnexion</Button>
      </Flex>

      <Card variation="elevated" marginTop="2rem">
        <Heading level={5}>Mon Accès Premium</Heading>
        <Text>Cliquez sur le bouton ci-dessous pour activer ou rafraîchir votre accès.</Text>
        <Button onClick={handleActivation} variation="primary" isFullWidth={true} marginTop="1rem">
          Activer ma Connexion Premium
        </Button>
        {status && <Text marginTop="1rem" color="blue">{status}</Text>}
      </Card>
    </View>
  );
};

// L'application principale qui gère l'authentification
export default function Home() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Dashboard user={user} signOut={signOut} />
      )}
    </Authenticator>
  );
}
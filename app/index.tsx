import { Redirect } from 'expo-router';

export default function Home() {
  // Redirect to the tabs layout
  return <Redirect href="/(tabs)" />;
}
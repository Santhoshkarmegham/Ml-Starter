import AuthForm from '../auth-form';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ setup?: string; error?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="signin" setup={params.setup === '1'} confirmationError={params.error === 'confirmation'} />;
}

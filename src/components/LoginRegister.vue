<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { ref, onMounted } from 'vue'
import { getAuth, GoogleAuthProvider, signInWithPopup,signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = getAuth();

const email_login = ref('')
const password_login = ref('')

const email_signup = ref('')
const password_signup = ref('')


const signInWithEmail = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.alert('Successfully signed in with email and password');
    router.push('/dashboard');
  } catch (error) {
    window.alert(`Error signing in with email and password: ${error}`);
  }
};

const signUpWithEmail = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email_signup.value, password_signup.value)
    window.alert('Successfully signed up with email and password');
    router.push('/dashboard');
  } catch (error) {
    window.alert(`Error signing up with email and password: ${error}`)
  }
}

const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    window.alert('Successfully signed in with Google');
    router.push('/dashboard');
  } catch (error) {
    window.alert(`Error signing in with Google: ${error}`);
  }
};

const darkMode = ref(getDarkMode());

function getDarkMode() {
  // Try to get the dark mode setting from localStorage
  const storedDarkMode = localStorage.getItem('darkMode');

  // If the setting exists, return it (converted to a boolean)
  if (storedDarkMode !== null) {
    return storedDarkMode === 'true';
  }

  // Otherwise, determine the setting based on the body class
  const body = document.querySelector('body');
  const isDark = body?.classList.contains('dark');
  return isDark;
}

function toggleDarkMode() {
  darkMode.value = !darkMode.value;

  // Store the new setting in localStorage
  localStorage.setItem('darkMode', darkMode.value.toString());

  const body = document.querySelector('body');
  body?.classList.toggle('dark', darkMode.value);
}

onMounted(() => {
  const body = document.querySelector('body');
  body?.classList.toggle('dark', darkMode.value);
});
</script>

<template>
  <div class="flex items-center ms-3">
    <Button variant="ghost" size="sm" class="mr-4" @click="toggleDarkMode">
      <span class="material-symbols-outlined">
        dark_mode
      </span>
    </Button>
  </div>
  <Tabs default-value="account" class="w-[400px]">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="account">
        Log in
      </TabsTrigger>
      <TabsTrigger value="password">
        Sign up
      </TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Login Account</CardTitle>
          <CardDescription>
            Login to your account to access your dashboard.
          </CardDescription>
          <Button class="bg-white border  dark:bg-gray-800  border-gray-300 text-gray-700 hover:bg-gray-100" @click="signInWithGoogle ">
          <img src="/google.svg" alt="Google icon" class="inline-block mr-2 w-5"> 
          <p class="text-dark dark:text-white">Log in with Google</p>
          
        </Button>
        </CardHeader>
        <CardContent class="space-y-2">
          <p class="flex items-center justify-center">or</p>
          <div class="space-y-1">
            <Label for="email">Email</Label>
            <Input v-model="email_login" placeholder="Utilize your university-provided email." />
          </div>
          <div class="space-y-1">
            <Label for="passwordLog">Password</Label>
            <Input v-model="password_login" type="password"/>
          </div>
        </CardContent>
        <CardFooter>
          <Button @click="() => signInWithEmail(email_login, password_login)">Log in</Button>
        </CardFooter>
      </Card>
    </TabsContent>
    <TabsContent value="password">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create a new account to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="space-y-1">
            <Label for="email">Email</Label>
            <Input v-model="email_signup" type="text" placeholder="Utilize your university-provided email." />
          </div>
          <div class="space-y-1">
            <Label for="password">Password</Label>
            <Input v-model="password_signup" type="password" />
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-5 items-start">
          <Button @click="signUpWithEmail">Sign up</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
</template>

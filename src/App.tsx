import { Route } from '@solidjs/router';
import Navbar from './components/Navigation/Navbar';
import Landing from './pages/Landing';
import Search from './pages/Search';
import NotFound from './pages/NotFound';

function Layout(props: any) {
  return (
    <div class="min-h-screen bg-gray-50">
      <Navbar />
      {props.children}
    </div>
  );
}

function App() {
  return (
    <Route path="/" component={Layout}>
      <Route path="/" component={Landing} />
      <Route path="/search" component={Search} />
      <Route path="*" component={NotFound} />
    </Route>
  );
}

export default App;
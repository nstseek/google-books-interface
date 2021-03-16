import React from 'react';
import Particles, { IParticlesParams } from 'react-particles-js';
import './App.scss';
import { ReactUIContext, useRootContext } from '@nstseek/react-ui/context';
import { ModalWarning } from '@nstseek/react-ui/components';
import BookList from 'components/BookList/BookList';
import 'moment/locale/pt-br';
import { Redirect, Route, Switch } from 'react-router';
import routes from 'routes';
import BookDetails from 'components/BookDetails/BookDetails';

/**
 * Define o sistema de partículas rodando no fundo da aplicação
 */
const particlesParam: IParticlesParams = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: false,
        value_area: 800
      }
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 1,
      random: true,
      anim: {
        enable: false,
        speed: 10,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: false
    },
    move: {
      enable: true,
      speed: 1,
      direction: 'none',
      random: true
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      repulse: {
        distance: 50,
        duration: 1
      },
      push: {
        particles_nb: 1,
        quantity: 5
      }
    }
  },
  retina_detect: true
};

const App: React.FC = () => {
  const uiRootCtx = useRootContext();

  return (
    <ReactUIContext.Provider value={uiRootCtx}>
      <ModalWarning />
      <div className='App'>
        <h1 className='title'>Google Books Interface</h1>
        <div className='main-container'>
          <Switch>
            <Route path={routes.home}>
              <BookList />
            </Route>
            <Route path={routes.livro + ':id'}>
              <BookDetails />
            </Route>
            <Redirect to={routes.home} />
          </Switch>
        </div>
        <Particles className='particles' params={particlesParam} />
      </div>
    </ReactUIContext.Provider>
  );
};

export default App;

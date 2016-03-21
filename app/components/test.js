import React from 'react';
import GithubIcon from './github_icon';
import {Button, IconButton} from 'react-toolbox/lib/button';
import ComponentContainer from './componentContainer';
import ComponentActions from '../actions/componentsActions';

import style from './style';


const ButtonTest = () => (
  <div>
    <ComponentContainer></ComponentContainer>
    <section>
      <h5>Audio</h5>
      <p></p>

      <Button icon='bookmark' label='Salon entero' accent raised/>
      <Button icon='bookmark' label='Salon y cocina' accent/>
      <Button icon='bookmark' label='Salon y baños' accent/>
      <Button icon='bookmark' label='Salon 1' primary/>
      <Button icon='bookmark' label='Salon 2' primary/>
      <Button icon='bookmark' label='Salon 3' primary/>
      <Button icon='bookmark' label='Cocina' primary/>
      <Button icon='bookmark' label='Habitacion grande' primary/>
      <Button icon='bookmark' label='Habitacion mediana' primary/>
      <Button icon='bookmark' label='Habitacion pequeña' primary/>
      <Button icon='bookmark' label='Cocina' primary/>
      <Button icon='bookmark' label='Baño entrada' primary/>
      <Button icon='bookmark' label='Baño habitaciones' primary/>

    </section>
    <section>
      <h5>Alumbrado</h5>
      <p></p>

      <Button href='http://github.com/javivelasco' target='_blank' raised>
        <GithubIcon/>
        Github
      </Button>
      <Button icon='bookmark' label='Bookmark' accent/>
      <Button icon='bookmark' label='Salon 1' primary/>
      <Button icon='inbox' label='Inbox' flat/>
      <Button icon='add' floating/>
      <Button icon='add' floating primary/>
      <Button icon='add' floating primary disabled/>
      <Button icon='add' floating accent mini/>
      <IconButton icon='favorite' accent/>
      <IconButton icon='favorite' inverse/>
      <IconButton icon='favorite'/>
      <IconButton icon='favorite' disabled/>
      <IconButton primary><GithubIcon/></IconButton>
      <Button icon='add' label='Add this' flat primary/>
      <Button icon='add' label='Add this' flat disabled/>
    </section>
  </div>

);

export default ButtonTest;

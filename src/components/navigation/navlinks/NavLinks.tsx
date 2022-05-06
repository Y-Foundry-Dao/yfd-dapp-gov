import NavLink from 'components/navigation/navlink/NavLink';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import navLinksAtom from 'recoil/navLinks/atom';

function NavLinks() {
  const navLinks = useRecoilValue(navLinksAtom);

  return (
    <Nav>
      <Ul>
        {navLinks.length > 0 &&
          navLinks.map((link: string, i: number) => {
            return <NavLink key={i} text={link} />;
          })}
      </Ul>
    </Nav>
  );
}

const Nav = styled.nav`
  width: 65%;

  /* hides nav bar on mobile */
  @media (max-width: 756px) {
    display: none;
  }
`;

const Ul = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  font-weight: 600;
  display: flex;
  justify-content: space-around;
`;

export default NavLinks;

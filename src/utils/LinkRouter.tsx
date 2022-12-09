import { Link, LinkProps } from 'react-router-dom';
import React from 'react';

const LinkRouter = React.forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, 'to'> & { href: LinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <Link data-testid="custom-link" ref={ref} to={href} {...other} />;
});
export default LinkRouter;

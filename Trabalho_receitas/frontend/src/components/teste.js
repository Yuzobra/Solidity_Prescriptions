import React from 'react';

import { useWeb3Context } from 'web3-react'



export const withWeb3Context = (Component) =>{
	return(props) =>{
		const context = useWeb3Context();
		return <Component context={context} {...props} />
	}
}
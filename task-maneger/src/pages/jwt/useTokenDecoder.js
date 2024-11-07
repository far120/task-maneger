import { useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import { Mycontext } from '../Auth/context';
export default function useTokenDecoder(){
    const { value, setValue } = useContext(Mycontext);
    const [decodedToken, setDecodedToken] = useState(null);

    useEffect(() => {
        if (value) {
            try {
                const decoded = jwtDecode(value); // استخدام jwtDecode
                setDecodedToken(decoded);
            } catch (err) {
                console.error("Invalid token", err);
            }
        }
    }, [value]);

    return decodedToken;
};

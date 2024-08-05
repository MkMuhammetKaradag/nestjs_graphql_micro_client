// import { ACTIVATE_USER } from '@/src/graphql/actions/activation.action';
import styles from '../../utils/styles';

import { useMutation } from '@apollo/client';
import { FC, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { ACTIVATION_USER } from '../../graphql/mutations/Activation';

type Props = {
  setActiveState: (route: string) => void;
};

type VerifyNumber = {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
};

const Verification: FC<Props> = ({ setActiveState }) => {
  const [ActivateUser, { loading }] = useMutation(ACTIVATION_USER);
  const [invalidError, setInvalidError] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: '',
    1: '',
    2: '',
    3: '',
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join('');
    const activationToken = localStorage.getItem('activation_token');

    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    } else {
      const data = {
        activationToken,
        activationCode: verificationNumber,
      };
      try {
        await ActivateUser({
          variables: {
            input: {
              ...data,
            },
          },
        });
        localStorage.removeItem('activation_token');
        toast.success('Account activated successfully!');
        setActiveState('Login');
      } catch (error: any) {
        console.log('GraphQL Errors:', error.graphQLErrors[0].message);
        toast.error(`Error  ${error.graphQLErrors[0].message}`);
      }
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Verify Your Account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            max={9}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black justify-center text-[18px] font-Poppins outline-none text-center ${
              invalidError ? 'shake border-red-500' : 'border-gray-600'
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="w-full flex justify-center">
        <button
          className={[
            'w-full text-[17px] font-semibold text-white py-3  cursor-pointer rounded-sm',
            Object.values(verifyNumber).some((value) => value === '')
              ? 'bg-gray-200'
              : 'bg-[#F02C56]',
          ].join(' ')}
          // disabled={loading}
          onClick={verificationHandler}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default Verification;

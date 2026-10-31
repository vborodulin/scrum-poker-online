import { pokerSessionsSchemas } from '@chpokify/api-schemas';
import { TEntityID } from '@chpokify/models-types';
import { routing } from '@chpokify/routing';
import { omit } from 'lodash';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { pokerSessionsActionsTypes } from '@Redux/domains/pokerSessions/actionTypes';
import { pokerSessionsAsyncActions } from '@Redux/domains/pokerSessions/asyncActions';
import { pokerSessionsSelectors } from '@Redux/domains/pokerSessions/selectors';
import { spacesSelectors } from '@Redux/domains/spaces/selectors';
import { uiActions } from '@Redux/domains/ui/actions';
import { uiTypes } from '@Redux/domains/ui/types';
import { getIsRejectedActionPayload } from '@Redux/helpers/common';
import { useAppDispatch } from '@Redux/hooks';

import { FORM_FIELDS, TFormData, TPokerSessionEditFormProps } from '@components/domains/poker/PokerSessionEditForm';

import { useAsyncActionInfo } from '@components/utils/hooks/useAsyncActionInfo';

type TUsePokerSessionCreateModal = Omit<TPokerSessionEditFormProps, 'onSubmit'> & {
  onSubmit: (data: TFormData) => Promise<void>;
};

type TUsePokerSessionCreateModalProps = {
  edit?: boolean;
  pokerSessionId?: TEntityID;
  onClose?: () => void,
};

const usePokerSessionCreateModal = (props: TUsePokerSessionCreateModalProps): TUsePokerSessionCreateModal => {
  const {
    edit = false,
    pokerSessionId = '',
    onClose = () => {
    },
  } = props;

  const router = useRouter();

  const dispatch = useAppDispatch();

  const spaceId = useSelector(spacesSelectors.getCurrSpaceId);
  const lastPokerSession = useSelector(pokerSessionsSelectors.getLastEntity);

  const {
    register,
    handleSubmit,
    errors,
    formState,
    watch,
    setError,
  } = useForm<TFormData>();

  const watchCardSetId = watch('cardSetId');

  const { errGlobalMsg } = useAsyncActionInfo(
    [pokerSessionsActionsTypes.CREATE_PENDING, pokerSessionsActionsTypes.UPDATE_PENDING],
    FORM_FIELDS,
    setError
  );

  const enhanceFormData = (data: TFormData): pokerSessionsSchemas.TCreateBodyReq => ({
    ...data,
    spaceId,
    teamsIds: [],
  });

  const onSubmit = async (data: TFormData) => {
    const dataSend = enhanceFormData(data);

    if (edit) {
      const { payload } = await dispatch(
        pokerSessionsAsyncActions.update(pokerSessionId, omit(dataSend, ['spaceId', 'teamsIds']))
      );

      if (!getIsRejectedActionPayload(payload)) {
        onClose();
      }
    } else {
      const { payload } = await dispatch(
        pokerSessionsAsyncActions.create(dataSend)
      );

      if (!getIsRejectedActionPayload(payload)) {
        await router.push(
          routing.getPokerSessionUrlTemplate(),
          routing.getPokerUrl(spaceId, payload.pokerSession._id)
        );
        dispatch(uiActions.modalOpen(uiTypes.MODAL_TYPES.POKER_SESSION_TEAMS_EDIT, {
          pokerSessionId: payload.pokerSession._id,
          lastPokerSessionId: lastPokerSession?._id,
          isCreateSession: true,
        }));
      }
    }
  };

  return {
    onSubmit,
    register,
    watchCardSetId,
    errors,
    formState,
    handleSubmit,
    errGlobalMsg,
  };
};

export {
  usePokerSessionCreateModal,
};

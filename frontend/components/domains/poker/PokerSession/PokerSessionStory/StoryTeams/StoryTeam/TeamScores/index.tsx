import { TEntityID, TPokerCardDeckScores } from '@chpokify/models-types';
import { get } from 'lodash';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';

import { pokerSessionsAsyncActions } from '@Redux/domains/pokerSessions/asyncActions';
import { pokerSessionsSelectors } from '@Redux/domains/pokerSessions/selectors';
import { spacesRepoSelectors } from '@Redux/domains/spacesRepo/selectors';
import { useAppDispatch } from '@Redux/hooks';

import { pokerHelpers } from '@components/domains/poker/helpers';

import { Box, TBoxProps } from '@components/uiKit/Box';
import { InputStealth, TInputStealthProps } from '@components/uiKit/InputStealth';
import { Tooltip } from '@components/uiKit/Tooltip';
import { TooltipDescription } from '@components/uiKit/TooltipDescription';

import { useDidmount } from '@components/utils/hooks/useDidmount';
import { Popper, POPPER_MODE } from '@components/utils/Popper';
import { popperTooltipOptions } from '@components/utils/Popper/options/tooltip';

const Root = styled(Box)<TBoxProps>`
position: relative;
`;

const StyledInputStealth = styled(InputStealth)<TInputStealthProps & { hasScores: boolean; color: string }>`
color: ${({
    theme,
    color,
  }) => get(theme.colors, color)};
opacity: ${({ hasScores }) => (hasScores ? 1 : 0.4)};
`;

export type TTeamScoresProps = Partial<TInputStealthProps> & {
  storyId: TEntityID;
  teamId: TEntityID;
}

const TeamScores = (props: TTeamScoresProps): React.ReactElement | null => {
  const {
    storyId,
    teamId,
    ...other
  } = props;

  const dispatch = useAppDispatch();
  const popperScoreIdRef = useRef(`team-score-${teamId}-${shortid()}`);
  const [tooltipTarget, setTooltipTarget] = useState<any>();

  const pokerSessionId = useSelector(pokerSessionsSelectors.getCurrId);

  const canModerate = useSelector(spacesRepoSelectors.getCanModerateMeCurr);

  const teamResult = useSelector(pokerSessionsSelectors.getTeamResultByStory)(
    pokerSessionId,
    storyId,
    teamId
  );

  const [scoresVal, setScoresVal] = useState<number>(pokerHelpers.getScoresView(teamResult?.scores));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const numVal = Number.parseInt(value, 10);

    if (Number.isNaN(numVal)) {
      setScoresVal(0);
    } else {
      setScoresVal(numVal);
    }
  };

  const parseSubmitVal = (val: number): TPokerCardDeckScores => {
    if (!val) {
      return null;
    }

    const numVal = parseInt(val.toString(), 10);

    if (Number.isNaN(numVal)) {
      return null;
    }

    return numVal;
  };

  const onRevealSubmit = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!pokerSessionId) return;

    await dispatch(pokerSessionsAsyncActions.storyTeamScoresSet(
      pokerSessionId,
      storyId,
      teamId,
      {
        scores: parseSubmitVal(scoresVal),
      }
    ));
  };

  const handleBlur = async () => {
    await onRevealSubmit();

    if (!scoresVal) {
      setScoresVal(scoresVal || 0);
    }
  };

  useDidmount(() => {
    setScoresVal(pokerHelpers.getScoresView(teamResult?.scores));
  }, [teamResult?.scores]);

  const renderTooltip = () => {
    if (!canModerate) {
      return null;
    }

    return (
      <Popper
        id={popperScoreIdRef.current}
        targetElement={tooltipTarget}
        options={popperTooltipOptions}
        mode={POPPER_MODE.HOVER}
      >
        <Tooltip>
          <TooltipDescription>
            Click to edit team scores
          </TooltipDescription>
        </Tooltip>
      </Popper>
    );
  };

  const getInputId = () => `team-scores-${teamId}`;

  const getColor = () => {
    if (!teamResult) {
      return 'font.normal';
    }

    const { isEdited } = teamResult;

    if (canModerate) {
      if (isEdited) {
        return 'font.positive';
      }

      return 'font.primary';
    }

    return 'font.normal';
  };

  return (
    <Root
      as="form"
      onSubmit={onRevealSubmit}
    >
      <StyledInputStealth
        id={getInputId()}
        ref={setTooltipTarget}
        value={scoresVal}
        isResizable
        textAlign="right"
        disabled={!canModerate}
        hasScores={pokerHelpers.getHasScores(teamResult?.scores)}
        color={getColor()}
        onChange={handleChange}
        onBlur={handleBlur}
        {...other}
      />
      {renderTooltip()}
    </Root>
  );
};

export {
  TeamScores,
};

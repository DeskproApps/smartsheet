import { forwardRef } from "react";
import { Label as UILabel } from "@deskpro/deskpro-ui";
import styled from "styled-components";
import type { FC, Ref } from "react";
import type { LabelProps } from "@deskpro/deskpro-ui";

export type Props = LabelProps & {
  marginBottom?: number
};

const Label: FC<Props> = styled(
  forwardRef((props, ref: Ref<HTMLLabelElement>) => (
    <UILabel ref={ref} {...props} />
  ))
)`
  margin-bottom: ${({ marginBottom = 10 }: Props) => marginBottom}px;
`;

export default Label

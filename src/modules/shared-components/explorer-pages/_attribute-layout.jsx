import React from 'react'
import { Grid, Cell, Card, CardTitle, CardText } from 'react-md'
import { cardStyle } from './_shared'

const CardTextStyle = { height: '350px', overflow: 'auto' }

export default ({ sections }) => (
  <Grid>
    {sections.map(({ title, subTitle, component }, i) => (
      <Cell key={i} phoneSize={4} tabletSize={8} size={6}>
        <Card style={cardStyle}>
          <CardTitle title={title} subtitle={subTitle} />
          <CardText>
            <div style={CardTextStyle}>{component}</div>
          </CardText>
        </Card>
      </Cell>
    ))}
  </Grid>
)

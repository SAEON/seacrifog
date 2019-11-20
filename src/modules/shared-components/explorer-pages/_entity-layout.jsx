import React from 'react'
import { Grid, Cell, Button } from 'react-md'

const itemMenuIconStyle = {
  float: 'right',
  marginLeft: '10px'
}

const titleBlockStyle = {
  textAlign: 'center'
}

const abstractStyle = { fontStyle: 'bold', margin: '20px 0 15px' }

export default ({ clickClose, clickDownload, clickEdit, title, authors, abstract, children }) => (
  <Grid noSpacing>
    <Cell size={12}>
      {/* Menu icons */}
      <Grid>
        <Cell size={12}>
          <Button onClick={clickClose} icon style={itemMenuIconStyle}>
            close
          </Button>
          <Button onClick={clickDownload} style={itemMenuIconStyle} icon>
            save_alt
          </Button>
          <Button onClick={clickEdit} style={itemMenuIconStyle} icon>
            edit
          </Button>
        </Cell>
      </Grid>

      {/* Title */}
      <Grid>
        <Cell size={12}>
          <div style={titleBlockStyle}>
            <h1>{title}</h1>
            <h4>{authors}</h4>
            <p style={abstractStyle}>ABSTRACT</p>
            <p>{abstract}</p>
          </div>
        </Cell>
      </Grid>

      {/* Main content */}
      {children}
    </Cell>
  </Grid>
)

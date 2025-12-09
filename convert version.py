
from ezdxf import recover

# Use the recover module to load the DXF files, the input files may not be error free:
doc, _ = recover.readfile("5 nested 46 by 12_5.dxf")
doc.dxfversion = "R2018"
doc.saveas("R2018.dxf")
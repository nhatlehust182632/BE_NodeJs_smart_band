select d.id
from devices d
Inner join user_devices ud ON ud.device_id = d.id
Where d.device_id = ?
AND ud.user_id = ?
and ud.pairing_status = 1;
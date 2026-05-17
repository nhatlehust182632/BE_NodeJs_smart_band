select d.device_code
from devices d
Inner join user_devices ud ON ud.device_id = d.id
Where d.device_code = ?
AND ud.user_id = ?
and pairing_status = 'paired';
select device_id
from user_devices
where device_id = ?
and user_id = ?
and pairing_status = 'paired';
import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from '../../context/configAxios';

const CancelOrderPopup = ({ open, onClose, maDonHang }) => {
  const [reason, setReason] = useState('');
  const handleCancelOrder = async () => {
    if (!reason) {
      alert('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }
    try {
      await axios.delete('/order', { data: { ma_don_hang: maDonHang, ly_do_huy: reason } });
      alert('Đơn hàng đã được hủy thành công');
      onClose(); // Đóng popup
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert('Hủy đơn hàng thất bại');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nhập lý do hủy đơn hàng</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label="Lý do hủy"
          type="text"
          fullWidth
          variant="outlined"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleCancelOrder} color="secondary">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelOrderPopup;

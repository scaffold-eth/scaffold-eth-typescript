import { notification } from 'antd';
import { NotificationInstance } from 'antd/lib/notification';
import { ReactElement, useEffect } from 'react';

let notificationApi: NotificationInstance;

export const useAntNotification = (): NotificationInstance => {
  return notificationApi;
};

export const useCreateAntNotificationHolder = (): ReactElement => {
  const [api, notificationHolder] = notification?.useNotification();

  useEffect(() => {
    notificationApi = api;
  }, [api]);

  return notificationHolder;
};
